export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path') || '';

  const folderPath = generateFolderPath(user.username, path);

  const kysely = getKysely();

  const query = getQuery(event);
  const isDetailsRequest = typeof query.details !== 'undefined';

  timer.start('db');

  let folder: NormalFolder | { updatedAt: Date; createdAt: Date } | undefined;

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

  // NOTE: That is much faster but, we lose database sorting, and js one, is pretty slow in compares
  // let folder: NormalFolder | { updatedAt: Date; createdAt: Date } | undefined;
  // const queryFolder = kysely
  //   .selectFrom('Folder')
  //   .where(({ and, eb }) => and([
  //     eb('Folder.path', '=', folderPath),
  //     eb('Folder.ownerId', '=', user.id),
  //   ]));

  // if (isDetailsRequest) {
  //   folder = await queryFolder
  //     .select(['updatedAt', 'createdAt'])
  //     .executeTakeFirst();
  // }
  // else {
  //   const defaultFolderSelect = ['Folder.id', 'Folder.name', 'Folder.path', 'Folder.root'] as const;

  //   const folders = await queryFolder
  //     .leftJoin('Note', 'Note.parentId', 'Folder.id')
  //     .leftJoin('Folder as Subfolder', 'Subfolder.parentId', 'Folder.id')
  //     .select([
  //       ...defaultFolderSelect,
  //       'Note.id as note_id', 'Note.name as note_name', 'Note.path as note_path',
  //       'Subfolder.id as subfolder_id', 'Subfolder.name as subfolder_name', 'Subfolder.path as subfolder_path',
  //     ])
  //     .limit(100)
  //     .execute();

  //   if (!folders || folders.length < 1)
  //     throw createError({ statusCode: 404 });

  //   folder = {
  //     id: folders[0].id!,
  //     name: folders[0].name!,
  //     path: folders[0].path!,
  //     root: folders[0].root!,

  //     notes: [],
  //     subfolders: [],
  //   };

  //   const inserted: Record<string, true> = {};

  //   for (const item of folders) {
  //     if (item.note_id && item.note_name && item.note_path && !inserted[item.note_path]) {
  //       inserted[item.note_path] = true;

  //       folder.notes.push({
  //         id: item.note_id,
  //         name: item.note_name,
  //         path: item.note_path,
  //       });
  //     }

  //     if (item.subfolder_id && item.subfolder_name && item.subfolder_path && !inserted[item.subfolder_path]) {
  //       inserted[item.subfolder_path] = true;

  //       folder.subfolders.push({
  //         id: item.subfolder_id,
  //         name: item.subfolder_name,
  //         path: item.subfolder_path,
  //         root: false,
  //       });
  //     }
  //   }
  // }
  timer.end();

  if (!folder)
    throw createError({ statusCode: 404 });

  timer.appendHeader(event);

  return folder;
});

export interface NormalFolder {
  id: string
  name: string
  path: string
  root: boolean

  notes: Array<{ id: string; name: string; path: string }>
  subfolders: Array<{ id: string; name: string; path: string; root: boolean }>
}
