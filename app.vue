<script setup lang="ts">
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
  });

  useHead({
    link: [
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
        // @ts-expect-error no types for font
        href: import('~/assets/fonts/Mona-Sans/Mona-Sans.woff2?url').then((url) => url.default),
      },
    ],
  }, { mode: 'server' });
}
</script>

<template>
  <NuxtLoadingIndicator color="var(--loading-indicator-color)" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
