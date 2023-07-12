import { getUserFromEvent } from '~/server/utils/auth';

export default defineNuxtPlugin({
  parallel: true,
  async setup() {
    const event = useRequestEvent();
    const user = useUser();

    user.value = await getUserFromEvent(event);

    if (!user.value)
      return;

    // @ts-expect-error devaule still will stringify this + i hope it will not break entire production
    user.value.id = `${user.value.id.toString()}n`;
  },
});
