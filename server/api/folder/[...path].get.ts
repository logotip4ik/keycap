import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');
  const folderPath = generateFolderPath(user.username, path);

  timer.start('db');
  const folder = await prisma.folder.findFirst({
    where: { path: folderPath, ownerId: user.id },

    select: {
      id: true,
      name: true,
      path: true,
      root: true,
      updatedAt: true,
      createdAt: true,

      notes: {
        select: { id: true, name: true, path: true },
        orderBy: { name: 'asc' },
      },

      subfolders: {
        select: { id: true, name: true, root: true, path: true },
        orderBy: { name: 'asc' },
      },
    },
  });
  timer.end();

  if (!folder)
    return createError({ statusCode: 404 });

  timer.appendHeader(event);

  return folder;
});
