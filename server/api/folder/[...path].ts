import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const timer = createTimer();

  timer.start('user');
  const user = await getUserFromEvent(event);
  timer.end();

  if (!user) return sendError(event, createError({ statusCode: 401 }));

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');
  const folderPath = generateFolderPath(user.username, path);

  if (isMethod(event, 'GET')) {
    timer.start('db');
    const folder = await prisma.folder.findFirst({
      where: { ownerId: user.id, path: folderPath },

      select: {
        id: true,
        name: true,
        path: true,
        root: true,
        updatedAt: true,
        createdAt: true,

        notes: {
          select: { id: true, name: true, path: true, updatedAt: true, createdAt: true },
          orderBy: { updatedAt: 'desc' },
        },

        subfolders: {
          select: { id: true, name: true, root: true, path: true, updatedAt: true, createdAt: true },
          orderBy: { name: 'asc' },
        },
      },
    });
    timer.end();

    if (!folder) return sendError(event, createError({ statusCode: 404 }));

    timer.appendHeader(event);

    return folder;
  }

  if (isMethod(event, 'POST')) {
    interface CreateFolderProps { name: string; parentId: string }

    const body = await readBody<CreateFolderProps>(event);

    try {
      timer.start('db');
      const folder = await prisma.folder.create({
        data: {
          name: body.name,
          path: folderPath,
          owner: { connect: { email: user.email } },
          parent: { connect: { id: toBigInt(body.parentId) } },
        },

        select: {
          id: true,
          name: true,
          path: true,
          root: true,

          updatedAt: true,
          createdAt: true,

          notes: true,
          subfolders: true,
        },
      });
      timer.end();

      timer.appendHeader(event);

      return folder;
    }
    catch {
      return sendError(event, createError({ statusCode: 500 }));
    }
  }

  if (isMethod(event, 'DELETE')) {
    try {
      timer.start('db');
      await prisma.folder.delete({ where: { path: folderPath } });
      timer.end();

      timer.appendHeader(event);

      return { ok: true };
    }
    catch (error) {
      return sendError(event, createError({ statusCode: 500 }));
    }
  }

  return { };
});
