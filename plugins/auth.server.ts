import { getUserFromEvent } from '~/server/utils/auth';

export default defineNuxtPlugin(async () => {
  const event = useRequestEvent();
  const user = useUser();

  user.value = await getUserFromEvent(event);
});
