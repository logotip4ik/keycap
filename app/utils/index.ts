export function getHydrationPromise(): undefined | Promise<unknown> {
  const nuxtApp = useNuxtApp();

  if (!nuxtApp.isHydrating) {
    return;
  }

  return new Promise((r) => nuxtApp.hooks.hookOnce('app:suspense:resolve', r));
}
