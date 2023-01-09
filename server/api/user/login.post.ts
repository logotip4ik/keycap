import type { User } from '@prisma/client';

import getPrisma from '~/prisma';
import { setAuthCookies, verifyPassword } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event) || {};

  if (!body.email || !body.password) {
    const error = createError({ statusCode: 400, statusMessage: 'not enough data' });

    return sendError(event, error);
  }

  const prisma = getPrisma();

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, email: true, username: true, password: true },
  });

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

  await setAuthCookies(event, safeUser);

  return safeUser;
});
