import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');
  const folderPath = generateFolderPath(user.username, path);

  if (generateRootFolderPath(user.username) === folderPath)
    return {};

  try {
    timer.start('db');
    await prisma.folder.delete({ where: { path: folderPath } });
    timer.end();

    timer.appendHeader(event);

    return { ok: true };
  }
  catch (error) {
    return createError({ statusCode: 500 });
  }
});
