import { jsonArrayFrom } from 'kysely/helpers/postgres';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  // empty string represents root folder
  const path = getRouterParam(event, 'path') || '';

  const folderPath = generateFolderPath(user.username, path);

  const selectFunction = getQuery(event).details === undefined
    ? selectFolder
    : selectFolderDetails;

  timer.start('db');
  const folder = await selectFunction(folderPath, user.id)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'folder.get failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  if (!folder) {
    throw createError({ status: 404 });
  }

  timer.appendHeader(event);

  return { data: folder };
});

function selectFolder(path: string, ownerId: string) {
  const kysely = getKysely();

  return kysely
    .selectFrom('Folder')
    .where('path', '=', path)
    .where('ownerId', '=', ownerId)
    .select((eb) => [
      'id',
      'name',
      'path',
      'root',
      jsonArrayFrom(
        eb.selectFrom('Note')
          .select(['Note.id', 'Note.name', 'Note.path'])
          .whereRef('Folder.id', '=', 'Note.parentId')
          .where('Note.ownerId', '=', ownerId)
          .orderBy('name asc')
          .limit(50),
      )
        .as('notes'),
      jsonArrayFrom(
        eb.selectFrom('Folder as Subfolder')
          .select(['Subfolder.id', 'Subfolder.name', 'Subfolder.path', 'Subfolder.root'])
          .where('ownerId', '=', ownerId)
          .whereRef('Subfolder.parentId', '=', 'Folder.id')
          .orderBy('name asc')
          .limit(25),
      )
        .as('subfolders'),
    ])
    .executeTakeFirst();
}

function selectFolderDetails(path: string, ownerId: string) {
  const kysely = getKysely();

  return kysely
    .selectFrom('Folder')
    .select(['updatedAt', 'createdAt'])
    .where('path', '=', path)
    .where('ownerId', '=', ownerId)
    .executeTakeFirst();
}
