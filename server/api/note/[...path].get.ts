import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const query = getQuery(event);
  const drizzle = getDrizzle();

  const isDetailsRequest = typeof query.details !== 'undefined';

  timer.start('db');
  const note = await drizzle.query.note.findFirst({
    where: and(
      eq(schema.note.path, notePath),
      eq(schema.note.ownerId, user.id),
    ),
    columns: isDetailsRequest
      ? { updatedAt: true, createdAt: true }
      : { id: true, name: true, content: true, path: true },
    ...(isDetailsRequest
      ? {
          with: {
            shares: {
              limit: 1,
              columns: { link: true, updatedAt: true, createdAt: true },
            },
          },
        }
      : {}),
  });
  // }).catch(async (err) => {
  //   await event.context.logger.error({ err, msg: 'note.findFirst failed' });
  // });
  timer.end();

  if (!note)
    throw createError({ statusCode: 404 });

  timer.appendHeader(event);

  return note;
});
