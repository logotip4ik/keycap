export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({ status: 400 });
  }

  const notePath = generateNotePath(user.username, path);

  const kysely = getKysely();

  timer.start('db');
  await kysely
    .deleteFrom('Note')
    .where('path', '=', notePath)
    .where('ownerId', '=', user.id)
    .execute()
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'note.delete failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  timer.appendHeader(event);

  return sendNoContent(event);
});
