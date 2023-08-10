export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  timer.start('db');

  // NOTE: maybe we should store view page in our's cache rather then vercel's isr ?

  await prisma.$transaction(async (tx) => {
    const shareToDelete = await tx.share.findFirst({
      where: {
        owner: { id: user.id },
        note: { path: notePath },
      },
      select: { id: true, link: true },
    }).catch(async (err) => {
      await event.context.logger.error({ err, msg: 'share.findFirst failed' });
    });

    if (!shareToDelete)
      throw createError({ statusCode: 400 });

    const deletedShare = await tx.share.delete({
      where: { id: shareToDelete.id },
      select: { id: true },
    }).catch(async (err) => {
      await event.context.logger.error({ err, msg: 'share.delete failed' });

      throw createError({ statusCode: 400 });
    });
  });

  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
