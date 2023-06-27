<script setup lang="ts">
import '~/polyfills/array-at';
import 'requestidlecallback-polyfill';

useHead({
  titleTemplate: (title) => title ? `${title} - Keycap` : 'Keycap - Better notes',
});

if (process.server) {
  useSeoMeta({
    ogImage: `https://${process.env.SITE_ORIGIN}/og-image.webp`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogUrl: `https://${process.env.SITE_ORIGIN}`,
    robots: { none: true },
    applicationName: 'Keycap',
    author: 'Bogdan Kostyuk',
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
  <Teleport to="body">
    <NuxtLoadingIndicator
      color="var(--loading-indicator-color)"
      :throttle="250"
    />
  </Teleport>

  <NuxtPage />
</template>
