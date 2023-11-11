export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const folderPath = generateFolderPath(user.username, path);

  if (generateRootFolderPath(user.username) === folderPath)
    return {};

  timer.start('db');
  const folder = await prisma.folder.delete({
    where: { path: folderPath, ownerId: user.id },
    select: { id: true },
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'folder.delete failed' });
  });
  timer.end();

  if (!folder)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  // nitro will automatically set status to 204 as no content
  return sendNoContent(event);
});
