import parseDuration from 'parse-duration';

import { toBigInt } from '~/server/utils';

const NEAR_HOUR = parseDuration('0.9 hour')!;

let prevInterval: NodeJS.Timer;

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const user = useUser();

    refreshAuth();
    // TODO: clear interval and setUserOnClient if user logged out
    prevInterval = setInterval(refreshAuth, NEAR_HOUR);

    function refreshAuth() {
      requestIdleCallback(async () => {
        const newUser = await $fetch('/api/user/refresh', { retry: 1 })
          .catch(() => null);

        const isSameUser = newUser && newUser.username === user.value?.username;

        if (!newUser || isSameUser)
          return;

        user.value = { ...newUser, id: toBigInt(newUser.id) };
      });
    }
  },
});
