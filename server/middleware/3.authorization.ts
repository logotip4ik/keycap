import type { HTTPMethod } from 'h3';

// NOTE: avg time to check auth is 0.01-0.02ms
export default defineEventHandler(async (event) => {
  const { oauthEnabled } = useRuntimeConfig(event).public;

  const path = event.path;
  const user = event.context.user;

  const authorizedRoutes: Array<{ path: string; onlyMethods?: Array<HTTPMethod> }> = [
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

  if (!oauthEnabled && path.startsWith('/api/oauth'))
    throw createError({ statusCode: 404 });

  if (isAuthorizedRoute && !user) {
    await removeAuthCookies(event);

    throw createError({ statusCode: 401 });
  }
});
