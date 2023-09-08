import type { TypeOf } from 'suretype';

type UpdatableFields = TypeOf<typeof folderUpdateSchema>;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const folderPath = generateFolderPath(user.username, path);

  const data = await readBody<UpdatableFields>(event) || {};

  if (data.name) data.name = data.name.trim();

  const validation = useFolderUpdateValidation(data);

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  // Shortcircuting as currently only folder name could be updated
  // But we don't require `name` prop in request body
  if (!data.name)
    return { ok: true };

  const now = new Date();
  const newFolderPath = makeNewItemPath(folderPath, data.name);

  const sqlStartsWithFolderPath = `${folderPath}/%`;
  const sqlFolderPathRegexp = `^${folderPath.replace(/\//g, '\/')}\/`;

  const replaceValue = `${newFolderPath}/`;

  timer.start('db');
  const res = await prisma.$transaction([
    prisma.$queryRaw`UPDATE "Folder" SET "name" = ${data.name}, "path" = ${newFolderPath}, "updatedAt" = ${now} WHERE ("Folder"."ownerId" = ${user.id} AND "Folder"."path"::text = ${folderPath})`,

    prisma.$queryRaw`UPDATE "Note" SET "path" = regexp_replace("path"::text, ${sqlFolderPathRegexp}, ${replaceValue}, 'c'), "updatedAt" = ${now} WHERE ("Note"."ownerId" = ${user.id} AND "Note"."path"::text LIKE ${sqlStartsWithFolderPath})`,
    prisma.$queryRaw`UPDATE "Folder" SET "path" = regexp_replace("path"::text, ${sqlFolderPathRegexp}, ${replaceValue}, 'c'), "updatedAt" = ${now} WHERE ("Folder"."ownerId" = ${user.id} AND "Folder"."path"::text LIKE ${sqlStartsWithFolderPath})`,
  ]).catch(async (err) => {
    await event.context.logger.error({ err }, 'rename folder failed');
  });
  timer.end();

  if (!res)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  return { ok: true };
});
