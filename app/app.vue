<script setup lang="ts">
const route = useRoute();
const { site } = useRuntimeConfig().public;
const { isSmallScreen, isFirefox, isSafari } = useDevice();
const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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
      href: '/fonts/Mona-Sans.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
    },
  ],
});

useSeoMeta({
  themeColor: () => prefersDarkMode.value ? '#111113' : '#FCFCFD',

  title: 'Keycap - Beautiful Notes',
  ogTitle: 'Keycap - Beautiful Notes',

  ogDescription: 'Beautiful Notes 💜. Fast, simple, shareable, synced between devices and purple.',
  ogImage: `${defaultProtocol}${site}/images/og-image.min.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  ogUrl: () => `${defaultProtocol}${site}${route.path}`,

  applicationName: 'Keycap',
  author: 'Bogdan Kostyuk',

  twitterSite: 'KeycapTheNotes',
  twitterCard: 'summary',
  twitterCreator: 'BogdanKostyuk_',
  twitterImage: `${defaultProtocol}${site}/images/og-image.min.jpg`,
  twitterImageAlt: 'Keycap',
});

onErrorCaptured((error) => {
  sendError(error);
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
  <div style="display: contents;">
    <NuxtRouteAnnouncer />

    <Toasts />

    <NuxtPage />
  </div>
</template>
