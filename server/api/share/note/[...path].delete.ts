import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();
  const storage = useStorage();

  timer.start('db');

  const shareToDelete = await prisma.share.findFirst({
    where: {
      AND: {
        owner: { id: user.id },
        note: { path: notePath },
      },
    },
    select: { id: true, link: true },
  }).catch(() => null);

  if (!shareToDelete)
    return createError({ statusCode: 400 });

  // how to find correct key https://github.com/unjs/nitro/blob/30675d4353f366395cdc0d53e9512aaa3f7c4bf7/src/runtime/cache.ts#L184
  const friendlyShareLink = shareToDelete.link.replace(/-/g, '');

  const [cacheKeys] = await Promise.all([
    storage.getKeys('cache/nitro'),
    prisma.share.delete({ where: { id: shareToDelete.id } }),
  ]);

  console.log(cacheKeys);

  const keyToDelete = cacheKeys.find((key) => key.includes(friendlyShareLink));
  console.log(keyToDelete);

  if (keyToDelete)
    await storage.removeItem(keyToDelete);

  timer.end();

  timer.appendHeader(event);

  return { ok: true };
});
