export default defineEventHandler(async (event) => {
  const timer = createTimer();

  timer.start('user');
  const user = await getUserFromEvent(event);
  timer.end();

  if (!user) {
    await removeAuthCookies(event);

    return sendError(event, createError({ statusCode: 401 }));
  }

  timer.appendHeader(event);

  return user;
});
