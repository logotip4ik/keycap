import '~/polyfills/array-at';

const NEAR_HOUR = parseDuration('0.9 hour')!;

export default defineNuxtPlugin({
  parallel: true,
  env: { islands: false },
  setup() {
    refreshAuth();

    setInterval(refreshAuth, NEAR_HOUR);
  },
});

function refreshAuth() {
  requestIdleCallback(async () => {
    const user = useUser();

    const newUser = await $fetch('/api/users/me', { retry: 1 })
      .catch(NOOP);

    const isSameUser = newUser && newUser.data.username === user.value?.username;

    if (!newUser || isSameUser) {
      return;
    }

    user.value = newUser.data;
  });
}
