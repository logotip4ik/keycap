import type { Prisma } from '@prisma/client';

export const selectors = defineFolderSelectors({
  default: {
    id: true,
    name: true,
    path: true,
    root: true,

    notes: {
      select: { id: true, name: true, path: true },
      orderBy: { name: 'asc' },
    },

    subfolders: {
      select: { id: true, name: true, path: true, root: true },
      orderBy: { name: 'asc' },
    },
  },

  details: {
    updatedAt: true,
    createdAt: true,
  },
});

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  // empty string represents root folder
  const path = getRouterParam(event, 'path') || '';

  const folderPath = generateFolderPath(user.username, path);

  const selectType: keyof typeof selectors = getQuery(event).details === undefined
    ? 'default'
    : 'details';

  timer.start('db');
  const folder = await prisma.folder.findFirst({
    where: { path: folderPath, ownerId: user.id },
    select: selectors[selectType],
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'folder.findFirst failed' });

    throw createError({ status: 400 });
  });
  timer.end();

  if (!folder)
    throw createError({ status: 404 });

  timer.appendHeader(event);

  return {
    data: folder as (
      Prisma.FolderGetPayload<{ select: typeof selectors['default'] }>
      | Prisma.FolderGetPayload<{ select: typeof selectors['details'] }>
    ),
  };
});
