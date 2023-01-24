export default defineNuxtRouteMiddleware((from) => {
  const user = useUser();

  if (!user.value)
    return navigateTo('/login');

  if (decodeURIComponent(user.value.username) !== decodeURIComponent(from.params.user as string))
    return abortNavigation({ statusCode: 401, statusMessage: 'You are not authorized to access this route' });
});
