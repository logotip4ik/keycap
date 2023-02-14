const NEAR_HOUR = 60 * 60 - 10; // in seconds

let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin(async () => {
  const user = useUser();

  const refreshToken = () => {
    const fetcher = () =>
      $fetch('/api/user/refresh', { method: 'POST', retry: 2 })
        // https://github.com/unjs/ofetch#%EF%B8%8F-handling-errors
        .catch((error) => error.data);

    window.requestIdleCallback(fetcher);
  };

  watch(user, (newUser) => {
    if (!newUser) return clearInterval(prevInterval);

    refreshToken();

    prevInterval = setInterval(refreshToken, NEAR_HOUR * 1000);
  }, { immediate: true });
});
