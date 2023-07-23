import type { SafeUser } from '~/types/server';

export default defineEventHandler(async (event) => {
  const isOriginMismatch = checkOriginForMismatch(event);

  if (isOriginMismatch)
    throw createError({ statusCode: 403 });

  const body = await readBody(event) || {};

  if (body.email) body.email = body.email.trim();
  if (body.password) body.password = body.password.trim();

  const validation = useLoginValidation(body);

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  // prisma: first query time - 79ms, then 3-4-5ms
  // kysely: first query time - 23ms, then 3-4ms
  const kysely = getKysely();

  const user = await kysely
    .selectFrom('User')
    .select(['id', 'email', 'username', 'password'])
    .where('email', '=', body.email)
    .executeTakeFirst();

  if (!user)
    throw createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

  if (!user.password)
    throw createError({ statusCode: 400, statusMessage: 'this account uses social auth' });

  const isPasswordValid = await verifyPassword(user.password, body.password)
    .catch(() => null);

  if (isPasswordValid === null)
    throw createError({ statusCode: 500 });

  if (isPasswordValid === false)
    throw createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

  const safeUser: SafeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  await setAuthCookies(event, safeUser);

  if (typeof body.browserAction !== 'undefined')
    return sendRedirect(event, `/@${safeUser.username}`);

  return safeUser;
});
