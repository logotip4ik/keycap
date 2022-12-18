import { getUserFromEvent, removeAuthCookies, setAuthCookies } from '~/server/utils/auth';

export default defineNuxtPlugin(async () => {
  const event = useRequestEvent();
  const user = useUser();

  const userFromCookies = await getUserFromEvent(event);

  if (!userFromCookies) {
    await removeAuthCookies(event);

    return;
  }

  user.value = userFromCookies;

  await setAuthCookies(event, userFromCookies);
});
