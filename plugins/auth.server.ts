import { getUserFromEvent } from '~/server/utils/auth';

export default defineNuxtPlugin(async () => {
  const event = useRequestEvent();
  const user = useUser();

  const userFromCookies = await getUserFromEvent(event);

  if (userFromCookies) user.value = userFromCookies;
});
