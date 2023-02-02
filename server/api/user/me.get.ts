export default defineEventHandler(async (event) => {
  const timer = createTimer();

  const { user } = event.context;

  if (!user) {
    await removeAuthCookies(event);

    return sendError(event, createError({ statusCode: 401 }));
  }

  timer.appendHeader(event);

  return user;
});
