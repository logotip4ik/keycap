export default defineEventHandler(async (event) => {
  if (event.context.user) return null;

  const isOriginMismatch = checkOriginForMismatch(event);

  if (isOriginMismatch)
    throw createError({ statusCode: 403 });

  const body = await readBody(event) || {};

  if (body.email) body.email = body.email.trim();
  if (body.username) body.username = body.username.trim().replace(/\s/g, '_');
  if (body.password) body.password = body.password.trim();

  const validation = useRegisterValidation(body);

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const kysely = getKysely();

  const user = await kysely
    .transaction()
    .execute(async (tx) => {
      const user = await tx
        .insertInto('User')
        .values({
          username: body.username,
          email: body.email,
          password: await hashPassword(body.password),
          updatedAt: new Date(),
        })
        .returning('id')
        .executeTakeFirst();

      if (!user)
        throw new Error('something wrong with user');

      await tx
        .insertInto('Folder')
        .values({
          name: `${body.username}'s workspace`,
          root: true,
          path: generateRootFolderPath(body.username),
          ownerId: user.id,
          updatedAt: new Date(),
        })
        .execute();

      return {
        id: user.id,
        username: body.username,
        email: body.email,
      };
    }).catch(() => null);

  if (!user)
    throw createError({ statusCode: 400, statusMessage: 'user with this email or username might already exist' });

  await setAuthCookies(event, user);

  if (typeof body.browserAction !== 'undefined')
    return sendRedirect(event, `/@${user.username}`);

  setResponseStatus(event, 201);

  return user;
});
