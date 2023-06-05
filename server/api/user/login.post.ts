import { getPrisma } from '~/prisma';

import type { SafeUser } from '~/types/server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {};

  if (body.email) body.email = body.email.trim();
  if (body.password) body.password = body.password.trim();

  const validation = useLoginValidator(body);

  if (!validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const prisma = getPrisma();

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, email: true, username: true, password: true },
  }).catch(() => null);

  if (!user)
    return createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

  const isPasswordValid = await verifyPassword(user.password, body.password)
    .catch(() => null);

  if (isPasswordValid === null)
    return createError({ statusCode: 500 });

  if (isPasswordValid === false)
    return createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

  const safeUser: SafeUser = { id: user.id, username: user.username, email: user.email };

  await setAuthCookies(event, safeUser);

  return safeUser;
});
