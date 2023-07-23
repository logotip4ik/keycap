export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const folderPath = generateFolderPath(user.username, path);

  if (generateRootFolderPath(user.username) === folderPath)
    return null;

  const kysely = getKysely();

  timer.start('db');
  const folder = await kysely
    .deleteFrom('Folder')
    .where(({ and, eb }) => and([
      eb('path', '=', folderPath),
      eb('ownerId', '=', user.id),
    ]))
    .executeTakeFirst()
    .catch(() => null);
  timer.end();

  if (!folder || folder.numDeletedRows < 1)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
