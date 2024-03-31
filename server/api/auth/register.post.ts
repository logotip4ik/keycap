import postgres from 'postgres';

import type { Static } from '@sinclair/typebox';
import type { SafeUser } from '~/types/server';

type RegisterFields = Static<typeof registerSchema>;

export default defineEventHandler(async (event) => {
  if (event.context.user) {
    return null;
  }

  const body = await readBody<RegisterFields>(event) || {};

  if (typeof body.email === 'string') {
    body.email = body.email.trim();
  }
  if (typeof body.username === 'string') {
    body.username = body.username.trim().replace(/\s/g, '_');
  }
  if (typeof body.password === 'string') {
    body.password = body.password.trim();
  }

  const error = registerValidator.Errors(body).First();

  // TODO: add data to error and match schemaPath with client inputs to highlight wrong inputs
  if (error) {
    throw createError({
      status: 400,
      message: formatTypboxError(error),
    });
  }

  const [usernameTaken, captchaValid] = await Promise.all([
    checkIfUsernameTaken(event, body.username),
    import.meta.config.turnstileEnabled ? validateTurnstileReponse(body['cf-turnstile-response']) : true,
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

  const hashedPassword = await hashPassword(body.password)
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
        email: body.email,
        username: body.username,
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
        name: `${body.username}'s workspace'`,
        root: true,
        path: generateRootFolderPath(body.username),
        ownerId: user.id,
        updatedAt: now,
      })
      .executeTakeFirst();

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
