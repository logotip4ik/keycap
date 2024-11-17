import type { $Fetch } from 'nitropack';

import '@ungap/with-resolvers';
import '~/polyfills/array-at';

const NEAR_HOUR = parseDuration('0.9 hour')!;

export default defineNuxtPlugin({
  parallel: true,
  env: { islands: false },
  setup() {
    const kfetch = $fetch.create({
      headers: protectionHeaders,
    }) as $Fetch;

    refreshAuth(kfetch);

    setInterval(refreshAuth, NEAR_HOUR, kfetch);

    return {
      provide: {
        kfetch,
      },
    };
  },
});

function refreshAuth(fetch: $Fetch) {
  requestIdleCallback(async () => {
    const user = useUser();

    const newUser = await fetch('/api/users/me', {
      retry: 1,
      responseType: 'json',
      headers: { Accept: 'application/json' },
    })
      .catch(NOOP);

    const isSameUser = newUser && newUser.data.username === user.value?.username;

    if (!newUser || isSameUser) {
      return;
    }

    user.value = newUser.data;
  });
}
