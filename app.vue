<script setup lang="ts">
import '~/polyfills/array-at';

import MonaSansURL from '~/assets/fonts/Mona-Sans/Mona-Sans.woff2?url';

setupErrorLogging();

const { site } = useRuntimeConfig().public;
const { isSmallScreen, isFirefox } = useDevice();

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
      firefox: isFirefox,
    },
  },

  link: [
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
      href: MonaSansURL,
    },
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

if (import.meta.dev) {
  useHead({
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-dev.ico' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-dev.ico' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-dev.ico' },
    ],
  });
}
</script>

<template>
  <NuxtPage />

  <Teleport to="#teleports">
    <NuxtRouteAnnouncer />
  </Teleport>

  <ClientOnly>
    <LazyWorkspaceToasts />
  </ClientOnly>
</template>
