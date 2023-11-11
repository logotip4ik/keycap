import { getUserFromEvent } from '~/server/utils/auth';

export default defineNuxtPlugin({
  parallel: true,
  async setup() {
    const event = useRequestEvent();
    const user = useUser();

    // @ts-expect-error devalue will still stringify this, so client will end up with string rather then bigint
    user.value = await getUserFromEvent(event);

    if (!user.value)
      return;

    user.value.id = `${user.value.id.toString()}n`;
  },
});
