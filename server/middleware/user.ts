export default defineEventHandler(async (event) => {
  const timer = createTimer();

  timer.start('user_resolution');
  event.context.user = await getUserFromEvent(event);
  timer.end();

  if (event.context.user)
    event.context.timer = timer;
});
