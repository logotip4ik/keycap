import type { NoteDetails as FolderDetails } from '~/types/note';
import type { FolderDefault } from '~/types/folder';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path') || '';

  const folderPath = generateFolderPath(user.username, path);

  const kysely = getKysely();

  const query = getQuery(event);
  const isDetailsRequest = typeof query.details !== 'undefined';

  timer.start('db');

  let folder: FolderDefault | Omit<FolderDetails, 'share'> | undefined;

  if (isDetailsRequest) {
    folder = await kysely
      .selectFrom('Folder')
      .where(({ and, eb }) => and([
        eb('path', '=', folderPath),
        eb('ownerId', '=', user.id),
      ]))
      .select(['updatedAt', 'createdAt'])
      .executeTakeFirst();
  }
  else {
    folder = await kysely
      .connection()
      .execute(async (db) => {
        // @ts-expect-error notes and subfolders will be added later
        const folder: NormalFolder | undefined = await db
          .selectFrom('Folder')
          .where(({ and, eb }) => and([
            eb('path', '=', folderPath),
            eb('ownerId', '=', user.id),
          ]))
          .select(['id', 'name', 'path', 'root'])
          .executeTakeFirst();

        if (!folder)
          throw createError({ statusCode: 404 });

        const [notes, subfolders] = await Promise.all([
          db
            .selectFrom('Note')
            .where(({ and, eb }) => and([
              eb('parentId', '=', folder.id),
              eb('ownerId', '=', user.id),
            ]))
            .select(['id', 'name', 'path'])
            .orderBy('name', 'asc')
            .limit(100)
            .execute(),

          db
            .selectFrom('Folder')
            .where(({ and, eb }) => and([
              eb('parentId', '=', folder.id),
              eb('ownerId', '=', user.id),
            ]))
            .select(['id', 'name', 'path', 'root'])
            .orderBy('name', 'asc')
            .limit(100)
            .execute(),
        ]);

        folder.notes = notes || [];
        folder.subfolders = subfolders || [];

        return folder;
      });
  }
  timer.end();

  if (!folder)
    throw createError({ statusCode: 404 });

  timer.appendHeader(event);

  return folder;
});
