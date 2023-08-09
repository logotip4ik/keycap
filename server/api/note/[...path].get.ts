export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();
  const selectParams = getNoteSelectParamsFromEvent(event);

  timer.start('db');
  const note = await prisma.note.findFirst({
    where: { path: notePath, ownerId: user.id },
    select: { ...selectParams },
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'note.findFirst failed' });
  });
  timer.end();

  if (!note)
    throw createError({ statusCode: 404 });

  timer.appendHeader(event);

  return note;
});
