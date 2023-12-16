export default defineEventHandler((event) => {
  removeAuthCookies(event);

  return sendRedirect(event, '/');
});
