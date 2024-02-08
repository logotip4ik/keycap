export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  timer.start('db');
  const recent = await getRecentForUser(user)
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'note.findMany failed' });
    });
  timer.end();

  timer.appendHeader(event);

  return { data: recent };
});
