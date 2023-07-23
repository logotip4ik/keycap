export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const kysely = getKysely();

  timer.start('db');
  const note = await kysely
    .deleteFrom('Note')
    .where(({ and, eb }) => and([
      eb('path', '=', notePath),
      eb('ownerId', '=', user.id),
    ]))
    .executeTakeFirst()
    .catch(() => null);
  timer.end();

  if (!note || note.numDeletedRows < 1)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  return null;
});
