<script setup lang="ts">
import MonaSansURL from '~/assets/fonts/Mona-Sans/Mona-Sans.woff2?url';

import '~/polyfills/array-at';

setupErrorLogging();

const route = useRoute();
const { site } = useRuntimeConfig().public;
const { isSmallScreen, isFirefox, isSafari } = useDevice();

useHead({
  htmlAttrs: {
    class: {
      'phone-or-tablet': isSmallScreen,
      'firefox': isFirefox,
      'safari': isSafari,
    },
  },
});

useServerHead({
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

useSeoMeta({
  title: 'Keycap - Beautiful Notes',
  ogTitle: 'Keycap - Beautiful Notes',

  ogDescription: 'Beautiful Notes 💜. Fast, simple, shareable, synced between devices and purple.',
  ogImage: `${protocol}://${site}/og-image.min.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  ogUrl: () => `${protocol}://${site}${route.path}`,

  applicationName: 'Keycap',
  author: 'Bogdan Kostyuk',

  twitterSite: 'KeycapTheNotes',
  twitterCard: 'summary',
  twitterCreator: 'BogdanKostyuk_',
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

  <Teleport to="#teleports">
    <ClientOnly>
      <LazyWorkspaceToasts />
    </ClientOnly>
  </Teleport>
</template>
