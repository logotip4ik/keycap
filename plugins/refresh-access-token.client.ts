const NEAR_HOUR = 60 * 60 - 10; // in seconds

let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin(async () => {
  const user = useUser();

  const refreshToken = () => {
    window.requestIdleCallback(() => {
      $fetch('/api/user/refresh', { retry: 1, ignoreResponseError: true });
    });
  };

  watch(user, (newUser) => {
    clearInterval(prevInterval);

    if (!newUser)
      return;

    refreshToken();

    prevInterval = setInterval(refreshToken, NEAR_HOUR * 1000);
  }, { immediate: true });
});
