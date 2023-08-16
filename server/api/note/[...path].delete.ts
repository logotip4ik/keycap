import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const drizzle = getDrizzle();

  timer.start('db');
  const note = await drizzle
    .delete(schema.note)
    .where(and(
      eq(schema.note.path, notePath),
      eq(schema.note.ownerId, user.id),
    )).catch(async (err) => {
      await event.context.logger.error({ err, msg: 'note.delete failed' });
    });
  timer.end();

  if (!note)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
