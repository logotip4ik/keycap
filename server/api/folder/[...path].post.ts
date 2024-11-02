import postgres from 'postgres';

export default defineEventHandler(async (event) => {
  const user = requireUserFromEvent(event);
  const timer = requireTimerFromEvent(event);

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({ status: 400 });
  }

  const data = await readSecureBody(event, folderCreateValidator, {
    path: generateFolderPath(user.username, path),
  });

  const kysely = getKysely();

  timer.start('db');
  const folder = await kysely
    .insertInto('Folder')
    .values({
      name: data.name,
      path: data.path,
      ownerId: user.id,
      parentId: data.parentId,
      updatedAt: new Date(),
    })
    .returning(['id', 'name', 'path', 'root'])
    .executeTakeFirst()
    .catch(async (err) => {
      if (
        err instanceof postgres.PostgresError
        && err.code === PostgresErrorCode.PG_UNIQUE_VIOLATION
      ) {
        throw createError({
          status: 400,
          message: 'Folder with such name already exists',
        });
      }

      await logger.error(event, { err, msg: 'folder.create failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  timer.appendHeader(event);

  if (!folder) {
    throw createError({ status: 500 });
  }

  setResponseStatus(event, 201);

  (folder as typeof folder & FolderContents).notes ||= [];
  (folder as typeof folder & FolderContents).subfolders ||= [];

  return {
    data: folder as typeof folder & FolderContents,
  };
});
