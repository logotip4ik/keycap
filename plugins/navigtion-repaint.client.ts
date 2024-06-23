// TODO: remove when new nuxt version released
export default defineNuxtPlugin(() => {
  const router = useRouter();

  onNuxtReady(() => {
    router.beforeResolve(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
        requestAnimationFrame(() => setTimeout(resolve, 0));
      });
    });
  });
});
