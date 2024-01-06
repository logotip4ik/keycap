import type { TypeOf } from 'suretype';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  // NOTE: path is actually is not required param for body
  // just to reuse object and thus improve perf, i think it
  // is better to type body as create schema and later set path
  const body = await readBody<TypeOf<typeof folderCreateSchema>>(event) || {};

  body.name = body.name?.trim();
  body.path = generateFolderPath(user.username, path);

  const validation = useFolderCreateValidation(body);

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const selectParams = getFolderSelectParamsFromEvent(event);

  timer.start('db');
  const folder = await prisma.folder.create({
    data: {
      name: body.name,
      path: body.path,
      owner: { connect: { email: user.email } },
      parent: { connect: { id: toBigInt(body.parentId) } },
    },

    select: selectParams,
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'folder.create failed' });

    throw createError({ statusCode: 400 });
  });
  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  folder.notes ||= [];
  folder.subfolders ||= [];

  return { data: folder };
});
