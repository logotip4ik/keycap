import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const drizzle = getDrizzle();

  const link = generateShareLink();

  timer.start('db');
  const share = await drizzle.transaction(async (tx) => {
    const note = await tx.query.note
      .findFirst({
        where: and(
          eq(schema.note.path, notePath),
          eq(schema.note.ownerId, user.id),
        ),
        columns: { id: true },
        with: {
          shares: {
            columns: { id: true },
          },
        },
      })
      .execute();

    if (!note)
      throw createError({ statusCode: 400 });

    if (note && note.shares && note.shares.length > 0)
      return note.shares[0];

    return await tx
      .insert(schema.share)
      .values({
        link,
        noteId: note.id,
        ownerId: user.id,
        updatedAt: new Date(),
      })
      .execute();
  })
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'cannot create share' });
    });
  timer.end();

  if (!share)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  return { link };
});
