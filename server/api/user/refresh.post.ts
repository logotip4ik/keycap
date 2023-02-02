export default defineEventHandler(async (event) => {
  const timer = createTimer();

  const { user } = event.context;

  if (!user) return send(event);

  timer.appendHeader(event);
  await setAuthCookies(event, user);

  return { ok: true };
});
