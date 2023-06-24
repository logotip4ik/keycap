export default defineEventHandler(async (event) => {
  event.context.identifier = getIdentifierFromEvent(event)!;

  const timer = createTimer();
  const logger = createLogger();

  timer.start('user_resolution');
  event.context.user = await getUserFromEvent(event);
  timer.end();

  event.context.logger = logger;

  if (event.context.user)
    event.context.timer = timer;
});
