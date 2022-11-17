import { createError, getRouterParam, isMethod, sendError } from 'h3';

import getPrisma from '~/prisma';
import { getUserFromEvent } from '~/server/utils/auth';
import { generateNotePath } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) return sendError(event, createError({ status: 401 }));

  const notePath = getRouterParam(event, 'path') as string;

  const prisma = getPrisma();

  if (isMethod(event, 'GET')) {
    const note = await prisma.note.findFirst({
      where: { path: generateNotePath(user.username, notePath), ownerId: user.id },
      select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
    });

    return note || {};
  }

  return {};
});
