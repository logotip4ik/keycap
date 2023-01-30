import type { User } from '@prisma/client';

import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; email?: string; password?: string }>(event) || {};

  if (!body.email || !body.username || !body.password) {
    const error = createError({ statusCode: 400, statusMessage: 'not enough data' });

    return sendError(event, error);
  }

  body.email = body.email.trim();
  body.username = body.username.trim().replace(/\s/g, '_');

  const timer = createTimer();
  const prisma = getPrisma();
  let user: Pick<User, 'id' | 'email' | 'username'>;

  try {
    timer.start('db');
    user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: await hashPassword(body.password),
        folders: {
          create: {
            name: `${body.username}'s workspace`,
            root: true,
            path: generateRootFolderPath(body.username),
          },
        },
      },

      select: { id: true, email: true, username: true },
    });
    timer.end();
  }
  catch {
    const error = createError({ statusCode: 400, statusMessage: 'user with this email or username might already exist' });

    return sendError(event, error);
  }

  timer.appendHeader(event);
  await setAuthCookies(event, user);

  return user;
});
