import { getUserFromEvent } from '~/server/utils/auth';

export default defineNuxtPlugin({
  parallel: true,
  env: { islands: false },
  async setup() {
    const event = useRequestEvent();
    const user = useUser();

    // @ts-expect-error devalue will still stringify this
    user.value = await getUserFromEvent(event);
  },
});
