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
        const notes = await db
          .selectFrom('Folder')
          .where(({ and, eb }) => and([
            eb('Folder.path', '=', folderPath),
            eb('Folder.ownerId', '=', user.id),
          ]))
          .leftJoin('Note', 'Note.parentId', 'Folder.id')
          .select([
            'Folder.id', 'Folder.name', 'Folder.path', 'Folder.root',
            'Note.id as note_id', 'Note.name as note_name', 'Note.path as note_path',
          ])
          .orderBy('Note.name', 'asc')
          .limit(100)
          .execute();

        if (!notes || notes.length < 1)
          throw createError({ statusCode: 404 });

        const folder: FolderDefault = {
          id: notes[0].id!,
          name: notes[0].name!,
          path: notes[0].path!,
          root: notes[0].root!,

          notes: [],
          subfolders: [],
        };

        const folders = kysely
          .selectFrom('Folder')
          .where(({ and, eb }) => and([
            eb('parentId', '=', folder.id),
            eb('ownerId', '=', user.id),
          ]))
          .select(['id', 'name', 'path'])
          .orderBy('name', 'asc')
          .limit(100)
          .execute();

        // should complete first loop before promise resolves
        for (const item of notes) {
          if (item.note_id && item.note_name && item.note_path) {
            folder.notes.push({
              id: item.note_id,
              name: item.note_name,
              path: item.note_path,
            });
          }
        }

        for (const item of await folders) {
          folder.subfolders.push({
            id: item.id,
            name: item.name,
            path: item.path,
            root: false,
          });
        }

        return folder;
      });
  }
  timer.end();

  if (!folder)
    throw createError({ statusCode: 404 });

  timer.appendHeader(event);

  return folder;
});
