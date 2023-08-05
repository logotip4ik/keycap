import type { SafeUser } from '~/types/server';

export default defineEventHandler(async (event) => {
  const isOriginMismatch = checkOriginForMismatch(event);

  if (isOriginMismatch) {
    event.context.logger.log('warn', 'suspicious origin mismatch', { path: event.path });

    throw createError({ statusCode: 403 });
  }

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

  const prisma = getPrisma();

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, email: true, username: true, password: true },
  }).catch((err) => {
    event.context.logger.log('error', 'user.findUnique failed', err, { path: event.path });
  });

  if (!user)
    throw createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

  if (!user.password)
    throw createError({ statusCode: 400, statusMessage: 'this account uses social auth' });

  const isPasswordValid = await verifyPassword(user.password, body.password)
    .catch((err) => {
      event.context.logger.log('error', 'password verification failed', err, { path: event.path });
    });

  if (isPasswordValid === null)
    throw createError({ statusCode: 500 });

  if (isPasswordValid === false)
    throw createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

  const safeUser: SafeUser = { id: user.id, username: user.username, email: user.email };

  await setAuthCookies(event, safeUser);

  if (typeof body.browserAction !== 'undefined')
    return sendRedirect(event, `/@${safeUser.username}`);

  return safeUser;
});
