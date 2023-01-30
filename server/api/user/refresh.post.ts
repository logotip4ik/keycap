export default defineEventHandler(async (event) => {
  const timer = createTimer();

  timer.start('user');
  const user = await getUserFromEvent(event);
  timer.end();

  if (!user) return send(event);

  timer.appendHeader(event);
  await setAuthCookies(event, user);

  return { ok: true };
});
