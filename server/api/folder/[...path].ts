import { createError, getRouterParams, isMethod, sendError } from 'h3';

import { getUserFromEvent } from '~/server/utils/auth';
import { generateFolderPath } from '~/server/utils';
import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const params: { path?: string } = getRouterParams(event) || {};

  if (!params?.path) params.path = '/';

  const user = await getUserFromEvent(event);

  if (!user) return sendError(event, createError({ status: 401 }));

  const prisma = getPrisma();

  const folderPath = generateFolderPath(user.username, params.path);

  if (isMethod(event, 'GET')) {
    const folder = await prisma.folder.findFirst({
      where: { ownerId: user.id, path: folderPath },

      select: {
        id: true,
        name: true,
        path: true,
        root: true,
        updatedAt: true,
        createdAt: true,

        notes: {
          select: { id: true, name: true, path: true, updatedAt: true, createdAt: true },
          orderBy: { updatedAt: 'desc' },
        },

        subfolders: {
          select: { id: true, name: true, path: true, updatedAt: true, createdAt: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!folder) sendError(event, createError({ status: 404 }));

    return folder;
  }

  return { };
});
