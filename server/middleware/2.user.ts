export default defineEventHandler(async (event) => {
  const timer = createTimer();

  timer.start('user_resolution');
  event.context.user = await getUserFromEvent(event);
  timer.end();

  // it's better to initialize logger after user
  // so it can get username to identify request
  event.context.logger = createLogger(event);

  let authorized: 'yes' | 'no' = 'no';

  if (event.context.user) {
    event.context.timer = timer;

    authorized = 'yes';
  }

  setHeader(event, 'X-Authorized', authorized);
});
