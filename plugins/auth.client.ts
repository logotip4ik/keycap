import { toBigInt } from '~/server/utils';

export default defineNuxtPlugin(() => {
  const route = useRoute();
  const user = useUser();

  if (user.value) return;

  $fetch('/api/user/me')
    .then((fetchedUser) => user.value = { ...fetchedUser, id: toBigInt(fetchedUser.id) })
    // https://github.com/unjs/ofetch#%EF%B8%8F-handling-errors
    .catch(async (error) => {
      if (error.statusCode === 401 && route.path.includes('/@'))
        await navigateTo('/login', { replace: true });
    });
});
