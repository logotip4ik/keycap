import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path') as string;
  const folderPath = generateFolderPath(user.username, path);

  if (generateRootFolderPath(user.username) === folderPath)
    return {};

  timer.start('db');
  const folder = await prisma.folder.delete({
    where: { path: folderPath },
    select: { id: true },
  }).catch((err) => {
    event.context.logger.error(err, 'folder.delete failed');
  });
  timer.end();

  if (!folder)
    return createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
