import postgres from 'postgres';

import type { Static } from '@sinclair/typebox';

type FolderCreateFields = Static<typeof folderCreateSchema>;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  // NOTE: path is actually is not required param for body
  // just to reuse object and thus improve perf, i think it
  // is better to type body as create schema and later set path
  const body = await readBody<FolderCreateFields>(event) || {};

  if (typeof body.name === 'string')
    body.name = body.name.trim();

  body.path = generateFolderPath(user.username, path);

  const error = folderCreateValidator.Errors(body).First();

  if (error) {
    throw createError({
      status: 400,
      message: formatTypboxError(error),
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
