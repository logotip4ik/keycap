export default defineNuxtRouteMiddleware(() => {
  const user = useUser();

  if (user.value) {
    return navigateTo(`/@${user.value.username}`);
  }
});
