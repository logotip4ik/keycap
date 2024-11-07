import type { NuxtApp } from '#app';

export function getHydrationPromise(nuxtApp: NuxtApp = useNuxtApp()): undefined | Promise<unknown> {
  if (!nuxtApp.isHydrating) {
    return;
  }

  return new Promise((r) => nuxtApp.hooks.hookOnce('app:suspense:resolve', r));
}
