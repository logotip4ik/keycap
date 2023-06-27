import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    return createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  timer.start('db');

  // NOTE: there is no point from removing cached page because website is hosted on vercel

  const error = await prisma.$transaction(async (tx) => {
    const shareToDelete = await tx.share.findFirst({
      where: {
        owner: { id: user.id },
        note: { path: notePath },
      },
      select: { id: true, link: true },
    }).catch(() => null);

    if (!shareToDelete)
      return createError({ statusCode: 400 });

    const deletedShare = await tx.share.delete({
      where: { id: shareToDelete.id },
      select: { id: true },
    }).catch(() => null);

    if (!deletedShare)
      return createError({ statusCode: 400 });
  });

  if (error)
    return error;

  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
