export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  timer.start('db');
  await prisma.note.delete({
    where: { path: notePath, ownerId: user.id },
    select: { id: true },
  }).catch(async (err) => {
    await logger.error(event, { err, msg: 'note.delete failed' });

    throw createError({ status: 400 });
  });
  timer.end();

  timer.appendHeader(event);

  return sendNoContent(event);
});
