import postgres from 'postgres';

import type { SafeUser } from '~/types/server';

export default defineEventHandler(async (event) => {
  if (event.context.user) {
    return null;
  }

  const body = await readSecureBody(event, registerValidator);

  const [usernameTaken, metadata] = await Promise.all([
    checkIfUsernameTaken(event, body.username),
    registerStorage.getItem(`continue:${body.code}`),
  ]);

  if (!metadata || metadata.email !== body.email) {
    throw createError({
      status: 422,
      message: 'Verification failed. Try sending verification email again.',
    });
  }

  if (usernameTaken) {
    throw createError({
      status: 400,
      message: 'Sorry... But this username is already taken.',
    });
  }

  const hashedPassword = await hashPassword(body.password)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'password hashing failed' });

      throw createError({ status: 500 });
    });

  const { public: { site } } = useRuntimeConfig();
  const kysely = getKysely();
  const now = new Date();

  const firstNoteTemplate = await getHtmlTemplate('FirstNote');
  const firstNote = processTemplate(firstNoteTemplate, {
    siteUrl: `https://${site}`,
  });

  const user = await kysely.transaction().execute(async (tx) => {
    const user = await tx
      .insertInto('User')
      .values({
        email: body.email,
        username: body.username,
        password: hashedPassword,
        updatedAt: now,
      })
      .returning('id')
      .executeTakeFirst()
      .catch((error) => {
        if (
          error instanceof postgres.PostgresError
          && error.code === PostgresErrorCode.PG_UNIQUE_VIOLATION
        ) {
          throw createError({
            status: 400,
            message: 'user with this email or username might already exist',
          });
        }
      });

    if (!user) {
      throw createError({ status: 500 });
    }

    const rootFolder = await tx
      .insertInto('Folder')
      .values({
        name: `${body.username}'s workspace'`,
        root: true,
        path: generateRootFolderPath(body.username),
        ownerId: user.id,
        updatedAt: now,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    await tx
      .insertInto('Note')
      .values({
        name: 'My first note',
        ownerId: user.id,
        parentId: rootFolder.id,
        path: generateFolderPath(body.username, encodeURI('My first note')),
        updatedAt: new Date(),
        content: firstNote,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    (user as SafeUser).email = body.email;
    (user as SafeUser).username = body.username;

    return user as SafeUser;
  }).catch(async (err) => {
    await logger.error(event, { err, msg: 'auth.register failed' });

    throw err;
  });

  await Promise.all([
    setAuthCookies(event, user),
    updateCacheEntry(
      getUserCacheKey(user.username, UserCacheName.Taken),
      true,
    ),
  ]);

  if (body.browserAction !== undefined) {
    return sendRedirect(event, `/@${user.username}`);
  }

  setResponseStatus(event, 201);

  return { data: user };
});
