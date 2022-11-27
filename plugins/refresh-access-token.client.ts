const REFRESH_AFTER = 60 * 60 - 10; // in seconds

let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin(async () => {
  const user = useUser();

  const refreshToken = () => {
    const fetcher = () => $fetch('/api/user/refresh', { method: 'POST' });

    let act = (cb: () => any) => cb();

    if (window.requestIdleCallback) act = window.requestIdleCallback;

    act(fetcher);
  };

  watch(user, (newUser) => {
    if (!newUser) return clearInterval(prevInterval);

    // NOTE: access token cant be accessed from client side,
    // so will refresh token immediately
    refreshToken();

    prevInterval = setInterval(refreshToken, REFRESH_AFTER * 1000);
  }, { immediate: true });
});
