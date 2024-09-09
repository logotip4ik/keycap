export default defineNuxtPlugin({
  parallel: true,
  env: { islands: false },
  setup() {
    const event = useRequestEvent();
    const user = useUser();

    // We can reuse already checked user from nitro's middleware.
    user.value = event!.context.user;
  },
});
