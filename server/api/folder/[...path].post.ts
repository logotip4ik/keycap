import postgres from 'postgres';

import type { TypeOf } from 'suretype';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  // NOTE: path is actually is not required param for body
  // just to reuse object and thus improve perf, i think it
  // is better to type body as create schema and later set path
  const body = await readBody<TypeOf<typeof folderCreateSchema>>(event) || {};

  if (typeof body.name === 'string')
    body.name = body.name.trim();

  body.path = generateFolderPath(user.username, path);

  const validation = useFolderCreateValidation(body);

  if (!validation.ok) {
    throw createError({
      status: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const kysely = getKysely();

  timer.start('db');
  const folder = await kysely
    .insertInto('Folder')
    .values({
      name: body.name,
      path: body.path,
      ownerId: user.id,
      parentId: body.parentId,
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

  if (!folder)
    throw createError({ status: 500 });

  setResponseStatus(event, 201);

  (folder as typeof folder & FolderContents).notes ||= [];
  (folder as typeof folder & FolderContents).subfolders ||= [];

  return {
    data: folder as typeof folder & FolderContents,
  };
});
