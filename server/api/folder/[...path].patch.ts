import { sql } from 'kysely';
import escapeRE from 'escape-string-regexp';

import type { TypeOf } from 'suretype';

type UpdatableFields = TypeOf<typeof folderUpdateSchema>;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  const folderPath = generateFolderPath(user.username, path);

  const data = await readBody<UpdatableFields>(event) || {};

  if (typeof data.name === 'string')
    data.name = data.name.trim();

  const validation = useFolderUpdateValidation(data);

  if (!validation.ok) {
    throw createError({
      status: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  // Short-circuiting as currently only folder name could be updated
  // But we don't require `name` prop in request body
  if (!data.name)
    return sendNoContent(event);

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
    await logger.error(event, { err, msg: 'rename folder failed' });

    if (err.code === PrismaError.RawQueryError) {
      throw createError({
        status: 400,
        message: 'Folder with such name already exists',
      });
    }

    throw createError({ status: 400 });
  });
  timer.end();

  timer.appendHeader(event);

  return sendNoContent(event);
});
