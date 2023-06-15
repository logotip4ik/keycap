import { toBigInt } from '~/server/utils';

const NEAR_HOUR = 60 * 60 - 10; // in seconds

let setUserOnClient = false;
let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin(() => {
  const user = useUser();
  const route = useRoute();

  // TODO: clear interval and setUserOnClient if user logged out

  const stop = watch(user, (newUser) => {
    clearInterval(prevInterval);

    if (newUser && setUserOnClient)
      return;

    setUserOnClient = process.client;

    refreshAuth();

    prevInterval = setInterval(refreshAuth, NEAR_HOUR * 1000);
  }, { immediate: true });

  function refreshAuth() {
    window.requestIdleCallback(async () => {
      const newUser = await $fetch('/api/user/refresh', { retry: 1, ignoreResponseError: true })
        .catch(async (error) => {
          if (error.statusCode === 401 && route.path.includes('/@'))
            await navigateTo('/login', { replace: true });
        });

      if (!newUser)
        return;

      stop();

      user.value = { ...newUser, id: toBigInt(newUser.id) };
    });
  }
});
