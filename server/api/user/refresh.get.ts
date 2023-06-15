export default defineEventHandler(async (event) => {
  const user = event.context.user!;

  await setAuthCookies(event, user);

  return user;
});
