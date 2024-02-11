<script setup lang="ts">
import '~/polyfills/array-at';

import MonaSansURL from '~/assets/fonts/Mona-Sans/Mona-Sans.woff2?url';

setupErrorLogging();

const { site } = useRuntimeConfig().public;
const userAgent = useRequestHeader('user-agent');

const isSmallScreen = import.meta.server
  ? isMobileOrTablet(userAgent!)
  : window.innerWidth < breakpoints.tablet;

provide(IsSmallScreenKey, isSmallScreen);

useHead({
  htmlAttrs: {
    class: {
      'phone-or-tablet': isSmallScreen,
    },
  },
});

useServerHead({
  htmlAttrs: {
    class: {
      firefox: isFirefox(userAgent!),
    },
  },

  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous', href: MonaSansURL },
  ],
});

const protocol = import.meta.prod ? 'https' : 'http';
useServerSeoMeta({
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
  twitterImage: `${protocol}://${site}/og-image.min.jpg`,
  twitterImageAlt: 'Keycap',
});

if (import.meta.client) {
  const UPDATE_WORKER_DELAY = parseDuration('1.5s')!;

  setTimeout(() => {
    requestIdleCallback(async () => {
      const { updateServiceWorker } = await import('~/utils/sw-controller');

      requestIdleCallback(updateServiceWorker);
    });
  }, UPDATE_WORKER_DELAY);
}
</script>

<template>
  <NuxtPage />

  <ClientOnly>
    <LazyWorkspaceToasts />
  </ClientOnly>
</template>
