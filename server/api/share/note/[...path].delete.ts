export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  timer.start('db');

  // NOTE: there is no point from removing cached page because website is hosted on vercel

  await prisma.$transaction(async (tx) => {
    const shareToDelete = await tx.share.findFirst({
      where: {
        owner: { id: user.id },
        note: { path: notePath },
      },
      select: { id: true, link: true },
    }).catch((err) => {
      event.context.logger.error('share.findFirst failed ', err, { path: event.path });
    });

    if (!shareToDelete)
      throw createError({ statusCode: 400 });

    const deletedShare = await tx.share.delete({
      where: { id: shareToDelete.id },
      select: { id: true },
    }).catch((err) => {
      event.context.logger.error('share.delete failed', err, { path: event.path });
    });

    if (!deletedShare)
      throw createError({ statusCode: 400 });
  });

  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
