import type { TypeOf } from 'suretype';

export default defineEventHandler(async (event) => {
  if (event.context.user)
    return null;

  const isOriginMismatch = checkOriginForMismatch(event);

  if (isOriginMismatch)
    throw createError({ statusCode: 403 });

  const body = await readBody<TypeOf<typeof registerSchema>>(event) || {};

  if (body.email)
    body.email = body.email.trim();
  if (body.username)
    body.username = body.username.trim().replace(/\s/g, '_');
  if (body.password)
    body.password = body.password.trim();

  const validation = useRegisterValidation(body);

  // TODO: add data to error and match schemaPath with client inputs to highlight wrong inputs
  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const [usernameTaken, captchaValid] = await Promise.all([
    checkIfUsernameTaken(body.username),
    validateTurnstileReponse(body['cf-turnstile-response']),
  ]);

  if (usernameTaken) {
    throw createError({
      statusCode: 400,
      message: 'Sorry... But this username is already taken',
    });
  }

  if (!captchaValid) {
    throw createError({
      statusCode: 422,
      message: 'Verification failed. Maybe try reloading the page ?',
    });
  }

  const prisma = getPrisma();

  const hashedPassword = await hashPassword(body.password)
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'password hashing failed' });

      throw createError({ statusCode: 500 });
    });

  const user = await prisma.user.create({
    data: {
      email: body.email,
      username: body.username,
      password: hashedPassword,
      folders: {
        create: {
          name: `${body.username}'s workspace`,
          root: true,
          path: generateRootFolderPath(body.username),
        },
      },
    },

    select: { id: true, email: true, username: true },
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'user.create failed' });

    throw createError({ statusCode: 400, message: 'user with this email or username might already exist' });
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
