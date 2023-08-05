export default defineEventHandler(async (event) => {
  const timer = createTimer();
  const logger = createLogger();

  timer.start('user_resolution');
  event.context.user = await getUserFromEvent(event);
  timer.end();

  event.context.logger = logger.child({
    path: event.path,
    user: event.context.user?.username,
  });

  let authorized: 'yes' | 'no' = 'no';

  if (event.context.user) {
    event.context.timer = timer;

    authorized = 'yes';
  }

  setHeader(event, 'X-Authorized', authorized);
});
