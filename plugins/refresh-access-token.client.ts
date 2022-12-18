const REFRESH_AFTER = 60 * 60 - 10; // in seconds

let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin(async () => {
  const user = useUser();

  const refreshToken = () => {
    const fetcher = () => $fetch('/api/user/refresh', { method: 'POST', retry: 2 });

    let actWith = (cb: () => any) => cb();

    if (window.requestIdleCallback) actWith = window.requestIdleCallback;

    actWith(fetcher);
  };

  watch(user, (newUser) => {
    if (!newUser) return clearInterval(prevInterval);

    // initial refresh of token is in auth.server.ts plugin
    // refreshToken();

    prevInterval = setInterval(refreshToken, REFRESH_AFTER * 1000);
  }, { immediate: true });
});
