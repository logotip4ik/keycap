import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  interface CreateFolderProps { name: string; parentId: string }

  const body = await readBody<CreateFolderProps>(event);
  const path = getRouterParam(event, 'path');

  if (!path)
    return createError({ statusCode: 400 });

  const folderPath = generateFolderPath(user.username, path);
  const folderName = body.name.trim();

  if (folderName.length < 2 || !body.parentId || !path)
    return createError({ statusCode: 400 });

  const selectParams = getFolderSelectParamsFromEvent(event);

  timer.start('db');
  const folder = await prisma.folder.create({
    data: {
      name: folderName,
      path: folderPath,
      owner: { connect: { email: user.email } },
      parent: { connect: { id: toBigInt(body.parentId) } },
    },

    select: { ...selectParams },
  }).catch((err) => {
    event.context.logger.log('error', 'folder.create failed', err, { path: event.path });
  });
  timer.end();

  if (!folder)
    return createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  return { ...folder, notes: [], subfolders: [] };
});
