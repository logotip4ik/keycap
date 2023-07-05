import parseDuration from 'parse-duration';

import { toBigInt } from '~/server/utils';

const NEAR_HOUR = parseDuration('0.9hour')!;

let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const user = useUser();
    const route = useRoute();

    // TODO: clear interval and setUserOnClient if user logged out

    watch(user, (newUser, oldUser) => {
      // prevents scenario when initially user is not defined
      // then fetches one, and refetches again because user changed
      // from null to { ...user }
      if (newUser && !oldUser)
        return;

      clearInterval(prevInterval);

      refreshAuth();

      if (newUser)
        prevInterval = setInterval(refreshAuth, NEAR_HOUR);
    }, { immediate: true });

    function refreshAuth() {
      requestIdleCallback(async () => {
        const newUser = await $fetch('/api/user/refresh', { retry: 1 })
          .catch(async (error) => {
            if (error.statusCode === 401 && route.path.includes('/@'))
              await navigateTo('/login', { replace: true });
          });

        const isSameUser = newUser && newUser.username === user.value?.username;

        if (!newUser || isSameUser)
          return;

        user.value = { ...newUser, id: toBigInt(newUser.id) };
      });
    }
  },
});
