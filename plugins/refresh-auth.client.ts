import parseDuration from 'parse-duration';

const NEAR_HOUR = parseDuration('0.9 hour')!;

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    refreshAuth();
    // TODO: clear interval and setUserOnClient if user logged out
    setInterval(refreshAuth, NEAR_HOUR);
  },
});

function refreshAuth() {
  requestIdleCallback(async () => {
    const user = useUser();

    const newUser = await $fetch('/api/users/me', { retry: 1 })
      .catch(() => null);

    const isSameUser = newUser && newUser.username === user.value?.username;

    if (!newUser || isSameUser)
      return;

    user.value = { ...newUser, id: toBigInt(newUser.id) };
  });
}
