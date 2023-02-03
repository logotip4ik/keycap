import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const timer = createTimer();

  const { user } = event.context;

  if (!user)
    return createError({ statusCode: 401 });

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
