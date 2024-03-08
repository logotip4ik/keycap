import type { TypeOf } from 'suretype';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  // NOTE: path is actually is not required param for body
  // just to reuse object and thus improve perf, i think it
  // is better to type body as create schema and later set path
  const body = await readBody<TypeOf<typeof folderCreateSchema>>(event) || {};

  body.name = body.name?.trim();
  body.path = generateFolderPath(user.username, path);

  const validation = useFolderCreateValidation(body);

  if (!validation.ok) {
    throw createError({
      status: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  timer.start('db');
  const folder = await prisma.folder.create({
    data: {
      name: body.name,
      path: body.path,
      owner: { connect: { email: user.email } },
      parent: { connect: { id: toBigInt(body.parentId) } },
    },

    select: {
      id: true,
      name: true,
      path: true,
      root: true,
    },
  })
    .catch(async (err) => {
      if (err.code === PrismaError.UniqueConstraintViolation) {
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

  setResponseStatus(event, 201);

  (folder as typeof folder & FolderContents).notes ||= [];
  (folder as typeof folder & FolderContents).subfolders ||= [];

  return {
    data: folder as typeof folder & FolderContents,
  };
});
