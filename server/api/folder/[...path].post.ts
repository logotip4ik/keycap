import type { TypeOf } from 'suretype';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  // NOTE: path is actually is not required param for body
  // just to reuse object and thus improve pref, i think it
  // is better to type body as create schema and later set path
  const body = await readBody<TypeOf<typeof folderCreateSchema>>(event) || {};

  body.path = generateFolderPath(user.username, path);

  const validation = useFolderCreateValidation(body);

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
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
    .returning('id')
    .executeTakeFirst()
    .catch(() => null);
  timer.end();

  if (!folder)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  return {
    id: folder.id,
    name: body.name,
    path: body.path,
    root: false,
    notes: [],
    subfolders: [],
  };
});
