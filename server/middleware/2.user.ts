export default defineEventHandler(async (event) => {
  const timer = createTimer();
  const logger = createLogger();

  event.context.logger = logger;

  timer.start('user_resolution');
  event.context.user = await getUserFromEvent(event);
  timer.end();

  if (event.context.user)
    event.context.timer = timer;
});
