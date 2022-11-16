// import { createError, sendError } from 'h3';

// import { getUserFromEvent } from '~/server/utils/auth';
// import { generateFolderPath } from '~/server/utils';
// import getPrisma from '~/prisma';

import handler from './[...path]';

export default defineEventHandler(async (event) => {
  return await handler(event);
  // const user = await getUserFromEvent(event);

  // if (!user) return sendError(event, createError({ status: 401 }));

  // const prisma = getPrisma();

  // const folderPath = generateFolderPath(user.username, '/');
  // const rootFolder = await prisma.folder.findFirst({
  //   where: { ownerId: user.id, path: folderPath },

  //   select: {
  //     id: true,
  //     name: true,
  //     path: true,
  //     updatedAt: true,
  //     createdAt: true,

  //     notes: {
  //       select: { id: true, title: true, updatedAt: true, createdAt: true },
  //       orderBy: { updatedAt: 'desc' },
  //     },

  //     subfolders: {
  //       select: { id: true, name: true, path: true, updatedAt: true, createdAt: true },
  //       orderBy: { name: 'asc' },
  //     },
  //   },
  // });

  // return rootFolder;
});
