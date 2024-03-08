export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  // NOTE: maybe we should store view page in our's cache rather then vercel's isr ?
  timer.start('db');
  await prisma.$transaction(async (tx) => {
    const shareToDelete = await tx.share.findFirst({
      where: { note: { path: notePath }, ownerId: user.id },
      select: { id: true, link: true },
    }).catch(async (err) => {
      await logger.error(event, { err, msg: 'share.findFirst failed' });

      throw createError({ status: 400 });
    });

    if (!shareToDelete)
      throw createError({ status: 404 });

    await tx.share.delete({
      where: { id: shareToDelete.id },
      select: { id: true },
    }).catch(async (err) => {
      await logger.error(event, { err, msg: 'share.delete failed' });

      throw createError({ status: 400 });
    });
  });
  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return sendNoContent(event);
});
