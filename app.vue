<script setup lang="ts">
if (process.server) {
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
