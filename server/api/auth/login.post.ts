import type { TypeOf } from 'suretype';
import type { SafeUser } from '~/types/server';

export default defineEventHandler(async (event) => {
  const body = await readBody<TypeOf<typeof loginSchema>>(event) || {};

  if (typeof body.email === 'string')
    body.email = body.email.trim();
  if (typeof body.password === 'string')
    body.password = body.password.trim();

  const validation = useLoginValidation(body);

  if (!validation.ok) {
    throw createError({
      status: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const kysely = getKysely();

  const user = await kysely
    .selectFrom('User')
    .where('email', '=', body.email)
    .select(['id', 'email', 'username', 'password'])
    .executeTakeFirst();

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
      .execute();
  }

  const safeUser: SafeUser = { id: user.id, username: user.username, email: user.email };

  await setAuthCookies(event, safeUser);

  if (body.browserAction !== undefined)
    return await sendRedirect(event, `/@${safeUser.username}`);

  return { data: safeUser };
});
