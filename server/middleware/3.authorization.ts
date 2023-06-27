import type { HTTPMethod } from 'h3';

// NOTE: avg time to check auth is 0.01-0.02ms
export default defineEventHandler(async (event) => {
  const path = event.path;
  const user = event.context.user;

  const authorizedRoutes: ({ path: string; onlyMethods?: HTTPMethod[] })[] = [
    { path: '/api/note' },
    { path: '/api/folder' },
    { path: '/api/search' },
    { path: '/api/user/refresh' },
    { path: '/api/share/note' },
  ];

  let isAuthorizedRoute = false;

  for (const route of authorizedRoutes) {
    isAuthorizedRoute = path!.startsWith(route.path);

    if (route.onlyMethods && !route.onlyMethods.some((method) => isMethod(event, method)))
      isAuthorizedRoute = false;

    if (isAuthorizedRoute)
      break;
  }

  if (isAuthorizedRoute && !user) {
    await removeAuthCookies(event);

    return createError({ statusCode: 401 });
  }
});
