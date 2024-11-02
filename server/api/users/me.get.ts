export default defineEventHandler(async (event) => {
  const user = requireUserFromEvent(event);

  await setAuthCookies(event, user);

  return { data: user };
});
