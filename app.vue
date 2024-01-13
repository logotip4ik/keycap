<script setup lang="ts">
import '~/polyfills/array-at';

import parseDuration from 'parse-duration';

import MonaSansURL from '~/assets/fonts/Mona-Sans/Mona-Sans.woff2?url';

setupErrorLogging();

// NOTE: should be removed from client bundle
const device = import.meta.server ? parseUA(useRequestHeaders()['user-agent']) : undefined;

const isSmallScreen = import.meta.server
  ? device!.isMobileOrTablet
  : window.innerWidth < breakpoints.tablet;

provide(IsSmallScreenKey, isSmallScreen);

if (import.meta.client) {
  const UPDATE_WORKER_DELAY = parseDuration('1.5s')!;

  setTimeout(() => {
    requestIdleCallback(async () => {
      const { updateServiceWorker } = await import('~/utils/sw-controller');

      requestIdleCallback(updateServiceWorker);
    });
  }, UPDATE_WORKER_DELAY);
}

useHead({
  htmlAttrs: {
    class: {
      'firefox': import.meta.server
        ? device!.isFirefox
        : isFirefox(navigator.userAgent),
      'phone-or-tablet': isSmallScreen,
    },
  },
});

if (import.meta.server) {
  const { site } = useRuntimeConfig().public;

  const protocol = import.meta.prod ? 'https' : 'http';

  useSeoMeta({
    title: 'Keycap - Better Notes',
    ogTitle: 'Keycap - Better Notes',
    ogDescription: 'Better then just notes ❤. Synced between your devices, simple, fast and purple.',
    ogImage: `${protocol}://${site}/og-image.min.jpg`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogUrl: `${protocol}://${site}`,
    robots: { none: true },
    applicationName: 'Keycap',
    author: 'Bogdan Kostyuk',
    twitterCard: 'summary',
    twitterCreator: '@bogdankostyuk_',
  });

  useServerHead({
    link: [
      { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous', href: MonaSansURL },
    ],
  });
}
</script>

<template>
  <NuxtPage />

  <ClientOnly>
    <LazyWorkspaceToasts />
  </ClientOnly>
</template>
