export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  timer.start('db');
  await prisma.note.delete({
    where: { path: notePath, ownerId: user.id },
    select: { id: true },
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'note.delete failed' });

    throw createError({ statusCode: 400 });
  });
  timer.end();

  timer.appendHeader(event);

  // nitro will automatically set status to 204 as no content
  return sendNoContent(event);
});
