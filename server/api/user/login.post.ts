import type { User } from '@prisma/client';

import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event) || {};

  if (!body.email || !body.password) {
    const error = createError({ statusCode: 400, statusMessage: 'not enough data' });

    return sendError(event, error);
  }

  const timer = createTimer();
  const prisma = getPrisma();

  timer.start('db');

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, email: true, username: true, password: true },
  });

  timer.end();

  if (!user) {
    const error = createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

    return sendError(event, error);
  }

  try {
    if (!(await verifyPassword(user.password, body.password))) {
      const error = createError({ statusCode: 400, statusMessage: 'email or password is incorrect' });

      return sendError(event, error);
    }
  }
  catch {
    const error = createError({ statusCode: 500 });

    return sendError(event, error);
  }

  const safeUser: Pick<User, 'id' | 'username' | 'email'> = { id: user.id, username: user.username, email: user.email };

  timer.appendHeader(event);
  await setAuthCookies(event, safeUser);

  return safeUser;
});
