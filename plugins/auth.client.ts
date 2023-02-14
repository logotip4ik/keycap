export default defineNuxtPlugin(() => {
  const user = useUser();

  if (user.value) return;

  $fetch('/api/user/me')
    .then((fetchedUser) => user.value = fetchedUser)
    // https://github.com/unjs/ofetch#%EF%B8%8F-handling-errors
    .catch((error) => error.data);
});
