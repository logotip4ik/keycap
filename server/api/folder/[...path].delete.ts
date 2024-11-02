export default defineEventHandler(async (event) => {
  const user = requireUserFromEvent(event);
  const timer = requireTimerFromEvent(event);

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({ status: 400 });
  }

  const folderPath = generateFolderPath(user.username, path);

  if (generateRootFolderPath(user.username) === folderPath) {
    return sendNoContent(event);
  }

  const kysely = getKysely();

  timer.start('db');
  await kysely
    .deleteFrom('Folder')
    .where('path', '=', folderPath)
    .where('ownerId', '=', user.id)
    .execute()
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'folder.delete failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  timer.appendHeader(event);

  return sendNoContent(event);
});
