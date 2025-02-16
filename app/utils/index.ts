import type { Component } from 'vue';

export function getHydrationPromise(): undefined | Promise<unknown> {
  const nuxtApp = useNuxtApp();

  if (!nuxtApp.isHydrating) {
    return;
  }

  return new Promise((r) => nuxtApp.hooks.hookOnce('app:suspense:resolve', r));
}

/**
 * Nuxt has own `preloadComponents` function, but it has limitation of only preloading global
 * registered components. This function will take a `Lazy...` component and call `__asyncLoader` on
 * it (if it has one)
 *
 * @param {Component} component vue lazy component
 */
export function preloadComponent(component: Component) {
  const loader = '__asyncLoader';
  if (loader in component && typeof component[loader] === 'function') {
    component[loader]();
  }
}
