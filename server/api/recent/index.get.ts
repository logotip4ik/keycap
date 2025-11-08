export default defineEventHandler(async (event) => {
  const user = requireUserFromEvent(event);
  const timer = requireTimerFromEvent(event);

  timer.start('db');
  const recent = await getRecentForUser(user)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'recent failed' });
    });
  timer.end();

  timer.appendHeader(event);

  return { data: recent };
});
