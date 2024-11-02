import escapeRE from 'escape-string-regexp';
import { sql } from 'kysely';
import postgres from 'postgres';

export default defineEventHandler(async (event) => {
  const user = requireUserFromEvent(event);
  const timer = requireTimerFromEvent(event);

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({ status: 400 });
  }

  const folderPath = generateFolderPath(user.username, path);

  const data = await readSecureBody(event, folderUpdateValidator);

  // Short-circuiting as currently only folder name could be updated
  // But we don't require `name` prop in request body
  if (!data.name) {
    return sendNoContent(event);
  }

  const kysely = getKysely();

  const now = new Date();
  const folderPathReplacementRE = `^${escapeRE(folderPath)}`;
  const newFolderPath = makeNewItemPath(folderPath, data.name);

  timer.start('db');
  await kysely.transaction().execute(async (tx) => {
    await Promise.all([
      tx.updateTable('Folder')
        .where('ownerId', '=', user.id)
        .where('path', '=', folderPath)
        .set({
          name: data.name,
          updatedAt: now,
          path: newFolderPath,
        })
        .executeTakeFirstOrThrow(),

      tx.updateTable('Folder')
        .where('ownerId', '=', user.id)
        .where('path', 'like', `${folderPath}/%`)
        .set((eb) => ({
          updatedAt: now,
          path: sql`regexp_replace(${eb.ref('path')}, ${folderPathReplacementRE}, ${newFolderPath}, 'c')`,
        }))
        .execute(),

      tx
        .updateTable('Note')
        .where('ownerId', '=', user.id)
        .where('path', 'like', `${folderPath}/%`)
        .set((eb) => ({
          updatedAt: now,
          path: sql`regexp_replace(${eb.ref('path')}, ${folderPathReplacementRE}, ${newFolderPath}, 'c')`,
        }))
        .execute(),
    ]);
  }).catch(async (err) => {
    if (
      err instanceof postgres.PostgresError
      && err.code === PostgresErrorCode.PG_UNIQUE_VIOLATION
    ) {
      throw createError({
        status: 400,
        message: 'Folder with such name already exists',
      });
    }

    await logger.error(event, { err, msg: 'folder.update failed' });

    throw createError({ status: 400 });
  });
  timer.end();

  timer.appendHeader(event);

  return sendNoContent(event);
});
