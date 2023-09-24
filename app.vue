<script setup lang="ts">
import '~/polyfills/array-at';

import parseDuration from 'parse-duration';

setupErrorLogging();

// NOTE: should be removed from client bundle
const device = import.meta.server ? parseUA(useRequestHeaders()['user-agent']) : undefined;

const isFirefox = import.meta.server
  ? device!.isFirefox
  : checkIsFirefox(navigator.userAgent);
const isSmallScreen = import.meta.server
  ? device!.isMobileOrTablet
  : window.innerWidth < breakpoints.tablet;

provide(IsSmallScreenKey, isSmallScreen);
provide(IsFirefoxKey, isFirefox);

if (import.meta.client) {
  const UPDATE_WORKER_DELAY = parseDuration('1.5s')!;

  setTimeout(() => {
    requestIdleCallback(async () => {
      const { updateServiceWorker } = await import('~/utils/sw-controller');

      requestIdleCallback(updateServiceWorker);
    });
  }, UPDATE_WORKER_DELAY);
}

if (import.meta.server) {
  const { siteOrigin } = useRuntimeConfig().public;

  const protocol = import.meta.prod ? 'https' : 'http';

  useSeoMeta({
    title: 'Keycap - Better Notes',
    ogTitle: 'Keycap - Better Notes',
    ogDescription: 'Better then just notes ❤. Synced between your devices, simple, fast and purple.',
    ogImage: `${protocol}://${siteOrigin}/og-image.webp`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogUrl: `${protocol}://${siteOrigin}`,
    robots: { none: true },
    applicationName: 'Keycap',
    author: 'Bogdan Kostyuk',
    twitterCard: 'summary',
  }, { mode: 'server' });

  useHead({
    htmlAttrs: {
      class: {
        'firefox': isFirefox,
        'phone-or-tablet': isSmallScreen,
      },
    },

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
