import type { TypeOf } from 'suretype';

type UpdatableFields = TypeOf<typeof folderUpdateSchema>;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  const folderPath = generateFolderPath(user.username, path);

  const data = await readBody<UpdatableFields>(event) || {};

  if (data.name)
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

  const now = new Date();
  const newFolderPath = makeNewItemPath(folderPath, data.name);

  const sqlStartsWithFolderPath = `${folderPath}/%`;
  const sqlFolderPathRegexp = `^${folderPath}/`;

  const replaceValue = `${newFolderPath}/`;

  timer.start('db');
  await prisma.$transaction([
    prisma.$queryRaw`UPDATE "Folder" SET "name" = ${data.name}, "path" = ${newFolderPath}, "updatedAt" = ${now} WHERE ("Folder"."ownerId" = ${user.id} AND "Folder"."path"::text = ${folderPath})`,

    prisma.$queryRaw`UPDATE "Note" SET "path" = regexp_replace("path"::text, ${sqlFolderPathRegexp}, ${replaceValue}, 'c'), "updatedAt" = ${now} WHERE ("Note"."ownerId" = ${user.id} AND "Note"."path"::text LIKE ${sqlStartsWithFolderPath})`,
    prisma.$queryRaw`UPDATE "Folder" SET "path" = regexp_replace("path"::text, ${sqlFolderPathRegexp}, ${replaceValue}, 'c'), "updatedAt" = ${now} WHERE ("Folder"."ownerId" = ${user.id} AND "Folder"."path"::text LIKE ${sqlStartsWithFolderPath})`,
  ]).catch(async (err) => {
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
