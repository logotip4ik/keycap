import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  timer.start('db');

  const shareToDelete = await prisma.share.findFirst({
    where: {
      AND: {
        owner: { id: user.id },
        note: { path: notePath },
      },
    },
    select: { id: true },
  }).catch(() => null);

  if (!shareToDelete)
    return createError({ statusCode: 400 });

  await prisma.share.delete({
    where: { id: shareToDelete.id },
  });

  timer.end();

  timer.appendHeader(event);

  return { ok: true };
});
