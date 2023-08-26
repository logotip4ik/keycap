<script setup lang="ts">
import '~/polyfills/array-at';

import parseDuration from 'parse-duration';

const { width: windowWidth } = useWindowSize();

// NOTE: should be removed from client bundle
const device = import.meta.env.SSR ? parseUA(useRequestHeaders()['user-agent']) : undefined;

const isFirefox = import.meta.env.SSR
  ? device!.isFirefox
  : checkIsFirefox(navigator.userAgent);

const isSmallScreen = computed(() =>
  import.meta.env.SSR
    ? device!.isMobileOrTablet
    : windowWidth.value < breakpoints.tablet,
);
provide(IsSmallScreenKey, isSmallScreen);
provide(IsFirefoxKey, isFirefox);

useHead({
  htmlAttrs: {
    class: {
      'firefox': isFirefox,
      'phone-or-tablet': isSmallScreen.value,
    },
  },
});

if (!import.meta.env.SSR) {
  const UPDATE_WORKER_DELAY = parseDuration('1.5s')!;

  setTimeout(() => {
    requestIdleCallback(async () => {
      const { updateServiceWorker } = await import('~/utils/sw-controller');

      requestIdleCallback(updateServiceWorker);
    });
  }, UPDATE_WORKER_DELAY);
}

if (import.meta.env.SSR) {
  const { siteOrigin } = useRuntimeConfig().public;

  const prefix = import.meta.env.PROD ? 'https' : 'http';

  useSeoMeta({
    title: 'Keycap - Better Notes',
    ogTitle: 'Keycap - Better Notes',
    ogDescription: 'Better then just notes ❤. Synced between your devices, simple, fast and purple.',
    ogImage: `${prefix}://${siteOrigin}/og-image.webp`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogUrl: `${prefix}://${siteOrigin}`,
    robots: { none: true },
    applicationName: 'Keycap',
    author: 'Bogdan Kostyuk',
    twitterCard: 'summary',
  }, { mode: 'server' });

  useHead({
    link: [
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
        href: import('~/assets/fonts/Mona-Sans/Mona-Sans.woff2?url').then((url) => url.default),
      },
    ],
  }, { mode: 'server' });
}
</script>

<template>
  <NuxtPage />

  <ClientOnly>
    <LazyWorkspaceToasts />
  </ClientOnly>
</template>
