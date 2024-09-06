import type { SafeUser } from '~/types/server';

export default defineEventHandler(async (event) => {
  const data = await readSecureBody(event, loginValidator);

  const kysely = getKysely();

  const user = await kysely
    .selectFrom('User')
    .where('email', '=', data.email)
    .select(['id', 'email', 'username', 'password'])
    .executeTakeFirst()
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'auth.login failed (can\'t fetch user)' });
    });

  if (!user) {
    throw createError({ status: 400, message: 'email or password is incorrect' });
  }

  if (!user.password) {
    throw createError({ status: 400, message: 'this account uses social auth' });
  }

  const isPasswordValid = await verifyPassword(user.password, data.password)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'password verification failed' });

      throw createError({ status: 500 });
    });

  if (isPasswordValid === false) {
    throw createError({ status: 400, message: 'email or password is incorrect' });
  }

  // $2 - bcrypt
  if (user.password.startsWith('$2')) {
    const rehashedPassword = await hashPassword(data.password);

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

  if (data.browserAction !== undefined) {
    return sendRedirect(event, `/@${safeUser.username}`);
  }

  return { data: safeUser };
});
