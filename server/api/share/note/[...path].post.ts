export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  const link = generateShareLink();

  timer.start('db');
  const share = await prisma.$transaction(async (tx) => {
    const note = await tx.note.findFirst({
      where: { path: notePath, ownerId: user.id },
      select: { shares: { select: { id: true } } },
    });

    if (note?.shares && note?.shares.length > 0)
      return note.shares[0];

    return await tx.share.create({
      select: { id: true },
      data: {
        link,
        note: { connect: { path: notePath } },
        owner: { connect: { id: user.id } },
      },
    });
  }).catch((err) => {
    event.context.logger.log('error', 'share.create failed', err, { path: event.path });
  });
  timer.end();

  if (!share)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  return { link };
});
