import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const timer = createTimer();

  const user = event.context.user!;

  const prisma = getPrisma();

  interface CreateFolderProps { name: string; parentId: string }

  const body = await readBody<CreateFolderProps>(event);
  const path = getRouterParam(event, 'path');
  const folderPath = generateFolderPath(user.username, path);

  if (!body.name || !body.parentId || !path)
    return createError({ statusCode: 400 });

  try {
    timer.start('db');
    const folder = await prisma.folder.create({
      data: {
        name: body.name,
        path: folderPath,
        owner: { connect: { email: user.email } },
        parent: { connect: { id: toBigInt(body.parentId) } },
      },

      select: { id: true, name: true, path: true, root: true, updatedAt: true, createdAt: true },
    });
    timer.end();

    timer.appendHeader(event);

    return { ...folder, notes: [], subfolders: [] };
  }
  catch {
    return createError({ statusCode: 500 });
  }
});
