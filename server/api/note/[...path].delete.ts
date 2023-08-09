export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  timer.start('db');
  const note = await prisma.note.delete({
    where: { path: notePath },
    select: { id: true },
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'note.delete failed' });
  });
  timer.end();

  if (!note)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
