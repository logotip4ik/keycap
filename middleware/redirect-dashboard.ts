export default defineNuxtRouteMiddleware(() => {
  if (import.meta.dev) {
    return;
  }

  const user = useUser();

  if (user.value) {
    return navigateTo(`/@${user.value.username}`);
  }
});
