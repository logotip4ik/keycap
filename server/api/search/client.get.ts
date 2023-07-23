export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const query = getQuery(event) || {};

  const skip = { folders: 0, notes: 0 };
  const limit = { folders: 20, notes: 55 };

  if (query.skipNotes && !Number.isNaN(query.skipNotes))
    skip.notes = Number(query.skipNotes);
  if (query.skipFolders && !Number.isNaN(query.skipFolders))
    skip.folders = Number(query.skipFolders);

  if (query.limitNotes && !Number.isNaN(query.limitNotes))
    limit.notes = Number(query.limitNotes);
  if (query.limitFolders && !Number.isNaN(query.limitFolders))
    limit.folders = Number(query.limitFolders);

  const pathToSearch = generateRootFolderPath(user.username);

  const kysely = getKysely();

  timer.start('db');
  const [notes, folders] = await kysely
    .connection()
    .execute(async (db) => {
      return await Promise.all([
        db
          .selectFrom('Note')
          .select(['name', 'path'])
          .where(({ and, eb }) => and([
            eb('path', 'like', `${pathToSearch}%`),
            eb('ownerId', '=', user.id),
          ]))
          .offset(skip.notes)
          .limit(limit.notes)
          .execute(),

        db
          .selectFrom('Folder')
          .select(['name', 'path', 'root'])
          .where(({ and, eb }) => and([
            eb('path', 'like', `${pathToSearch}%`),
            eb('ownerId', '=', user.id),
          ]))
          .offset(skip.folders)
          .limit(limit.folders)
          .execute(),
      ]);
    })
    .catch(() => [null, null]);
  timer.end();

  if (!notes || !folders)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  return [...notes, ...folders] as FuzzyItem[];
});
