import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();
  const drizzle = getDrizzle();

  timer.start('db');

  // NOTE: maybe we should store view page in our's cache rather then vercel's isr ?

  await drizzle.transaction(async (tx) => {
    const note = await tx.query.note
      .findFirst({
        where: and(
          eq(schema.note.ownerId, user.id),
          eq(schema.note.path, notePath),
        ),
        columns: {},
        with: {
          shares: {
            columns: { id: true, link: true },
            limit: 1,
          },
        },
      })
      .execute();

    if (!note)
      throw createError({ statusCode: 400 });

    const shareToDelete = note.shares[0];

    if (!shareToDelete)
      throw createError({ statusCode: 400, statusMessage: 'no share to delete' });

    await tx
      .delete(schema.share)
      .where(eq(schema.share.id, shareToDelete.id))
      .execute();
  }).catch(console.log);
  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
