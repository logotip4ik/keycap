export default defineEventHandler(async (event) => {
  const path = event.path;
  const user = event.context.user;

  const authorizedRoutes = [
    '/api/note',
    '/api/folder',
    '/api/search',
    '/api/user/me',
    '/api/user/refresh',
    '/api/share/note',
  ];

  let isAuthorizedRoute = false;

  for (const route of authorizedRoutes) {
    isAuthorizedRoute = path!.startsWith(route);

    if (isAuthorizedRoute)
      break;
  }

  if (isAuthorizedRoute && !user) {
    await removeAuthCookies(event);

    return createError({ statusCode: 401 });
  }
});
