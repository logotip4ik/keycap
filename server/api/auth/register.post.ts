import postgres from 'postgres';

import type { SafeUser } from '~/types/server';

export default defineEventHandler(async (event) => {
  if (event.context.user) {
    return null;
  }

  const data = await readSecureBody(event, registerValidator);

  const [usernameTaken, captchaValid] = await Promise.all([
    checkIfUsernameTaken(event, data.username),
    import.meta.config.turnstileEnabled ? validateTurnstileReponse(data['cf-turnstile-response']) : true,
  ]);

  if (usernameTaken) {
    throw createError({
      status: 400,
      message: 'Sorry... But this username is already taken',
    });
  }

  if (!captchaValid) {
    throw createError({
      status: 422,
      message: 'Verification failed. Maybe try reloading the page ?',
    });
  }

  const hashedPassword = await hashPassword(data.password)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'password hashing failed' });

      throw createError({ status: 500 });
    });

  const kysely = getKysely();
  const now = new Date();

  const user = await kysely.transaction().execute(async (tx) => {
    const user = await tx
      .insertInto('User')
      .values({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        updatedAt: now,
      })
      .returning(['id'])
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

    await tx
      .insertInto('Folder')
      .values({
        name: `${data.username}'s workspace'`,
        root: true,
        path: generateRootFolderPath(data.username),
        ownerId: user.id,
        updatedAt: now,
      })
      .executeTakeFirst();

    (user as SafeUser).email = data.email;
    (user as SafeUser).username = data.username;

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

  if (data.browserAction !== undefined) {
    return sendRedirect(event, `/@${user.username}`);
  }

  setResponseStatus(event, 201);

  return { data: user };
});
