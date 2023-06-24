import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path') as string;
  const folderPath = generateFolderPath(user.username, path);

  const selectParams = getFolderSelectParamsFromEvent(event);

  timer.start('db');
  const folder = await prisma.folder.findFirst({
    where: { path: folderPath, ownerId: user.id },
    select: { ...selectParams },
  }).catch((err) => {
    event.context.logger.error(err, 'folder.findFirst failed');
  });
  timer.end();

  if (!folder)
    return createError({ statusCode: 404 });

  timer.appendHeader(event);

  return folder;
});
