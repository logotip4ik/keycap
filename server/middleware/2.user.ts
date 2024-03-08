export default defineEventHandler(async (event) => {
  const timer = createTimer();

  timer.start('user_resolution');
  event.context.user = await getUserFromEvent(event);
  timer.end();

  let authorized: 'yes' | 'no' = 'no';

  if (event.context.user) {
    event.context.timer = timer;

    authorized = 'yes';
  }

  setHeader(event, 'X-Authorized', authorized);
});
