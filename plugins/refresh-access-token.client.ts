const REFRESH_AFTER = 60 * 60 - 10; // in seconds

let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin(async () => {
  const user = useUser();

  const refreshToken = () => {
    const fetcher = () => $fetch('/api/user/refresh', { method: 'POST', retry: 2 });

    window.requestIdleCallback(fetcher);
  };

  watch(user, (newUser) => {
    if (!newUser) return clearInterval(prevInterval);

    refreshToken();

    prevInterval = setInterval(refreshToken, REFRESH_AFTER * 1000);
  }, { immediate: true });
});
