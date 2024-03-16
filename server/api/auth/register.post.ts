import type { TypeOf } from 'suretype';

import type { SafeUser } from '~/types/server';

export default defineEventHandler(async (event) => {
  if (event.context.user)
    return null;

  const body = await readBody<TypeOf<typeof registerSchema>>(event) || {};

  if (typeof body.email === 'string')
    body.email = body.email.trim();
  if (typeof body.username === 'string')
    body.username = body.username.trim().replace(/\s/g, '_');
  if (typeof body.password === 'string')
    body.password = body.password.trim();

  const validation = useRegisterValidation(body);

  // TODO: add data to error and match schemaPath with client inputs to highlight wrong inputs
  if (!validation.ok) {
    throw createError({
      status: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const [usernameTaken, captchaValid] = await Promise.all([
    checkIfUsernameTaken(body.username),
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

  const user = await kysely.transaction().execute(async (tx) => {
    const user = await tx
      .insertInto('User')
      .values({
        email: body.email,
        username: body.username,
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .returning(['id'])
      .executeTakeFirst();

    if (!user)
      throw createError({ status: 400, message: 'user with this email or username might already exist' });

    await tx
      .insertInto('Folder')
      .values({
        name: `${body.username}'s workspace'`,
        root: true,
        path: generateRootFolderPath(body.username),
        ownerId: user.id,
        updatedAt: new Date(),
      })
      .execute();

    (user as SafeUser).email = body.email;
    (user as SafeUser).username = body.username;

    return user as SafeUser;
  })
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'user.create failed' });

      throw createError({ status: 500 });
    });

  await Promise.all([
    setAuthCookies(event, user),
    updateCacheEntry(
      getUserCacheKey(user.username, UserCacheName.Taken),
      true,
    ),
  ]);

  if (body.browserAction !== undefined)
    return sendRedirect(event, `/@${user.username}`);

  setResponseStatus(event, 201);

  return { data: user };
});
