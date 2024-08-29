export default defineEventHandler((event) => {
  deleteAuthCookies(event);

  return sendRedirect(event, '/');
});
