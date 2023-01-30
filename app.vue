<script setup lang="ts">
// @ts-expect-error no types for font
import MonaSansUrl from '~/assets/fonts/Mona-Sans/Mona-Sans.woff2';

useHead({
  link: [
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
      href: MonaSansUrl.slice(1),
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="var(--loading-indicator-color)" />
    <NuxtPage />
  </NuxtLayout>
</template>
