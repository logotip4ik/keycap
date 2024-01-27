export default defineNuxtPlugin({
  parallel: true,
  env: { islands: false },
  async setup() {
    const event = useRequestEvent();
    const user = useUser();

    // We can reuse already checked user from nitro's middleware.
    // @ts-expect-error devalue will still stringify this
    user.value = event.context.user;
  },
});
