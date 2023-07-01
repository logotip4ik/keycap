import parseDuration from 'parse-duration';

import { toBigInt } from '~/server/utils';

const NEAR_HOUR = parseDuration('1 hour')! - 10;

let setUserOnClient = false;
let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const user = useUser();
    const route = useRoute();

    // TODO: clear interval and setUserOnClient if user logged out

    const stop = watch(user, (newUser) => {
      clearInterval(prevInterval);

      if (newUser && setUserOnClient)
        return;

      setUserOnClient = process.client;

      refreshAuth();

      prevInterval = setInterval(refreshAuth, NEAR_HOUR);
    }, { immediate: true });

    function refreshAuth() {
      requestIdleCallback(async () => {
        const newUser = await $fetch('/api/user/refresh', { retry: 1 })
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
  },
});
