import { getUserFromEvent } from '~/server/utils/auth';

export default defineNuxtPlugin({
  parallel: true,
  async setup() {
    const event = useRequestEvent();
    const user = useUser();

    user.value = await getUserFromEvent(event);
  },
});
