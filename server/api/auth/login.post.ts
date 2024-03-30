import type { Static } from '@sinclair/typebox';

import type { SafeUser } from '~/types/server';

type LoginFields = Static<typeof loginSchema>;

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginFields>(event) || {};

  if (typeof body.email === 'string')
    body.email = body.email.trim();
  if (typeof body.password === 'string')
    body.password = body.password.trim();

  const error = loginValidator.Errors(body).First();

  if (error) {
    throw createError({
      status: 400,
      message: formatTypboxError(error),
    });
  }

  const kysely = getKysely();

  const user = await kysely
    .selectFrom('User')
    .where('email', '=', body.email)
    .select(['id', 'email', 'username', 'password'])
    .executeTakeFirst()
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'auth.login failed (can\'t fetch user)' });
    });

  if (!user)
    throw createError({ status: 400, message: 'email or password is incorrect' });

  if (!user.password)
    throw createError({ status: 400, message: 'this account uses social auth' });

  const isPasswordValid = await verifyPassword(user.password, body.password)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'password verification failed' });

      throw createError({ status: 500 });
    });

  if (isPasswordValid === false)
    throw createError({ status: 400, message: 'email or password is incorrect' });

  // $2 - bcrypt
  if (user.password.startsWith('$2')) {
    const rehashedPassword = await hashPassword(body.password);

    await kysely
      .updateTable('User')
      .set({ password: rehashedPassword })
      .where('id', '=', user.id)
      .execute()
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'auth.login failed (can\'t update user password)' });
      });
  }

  const safeUser: SafeUser = { id: user.id, username: user.username, email: user.email };

  await setAuthCookies(event, safeUser);

  if (body.browserAction !== undefined)
    return sendRedirect(event, `/@${safeUser.username}`);

  return { data: safeUser };
});
