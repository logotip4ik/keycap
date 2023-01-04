<script setup>
import MonaSansUrl from '~/assets/fonts/Mona-Sans/Mona-Sans.woff2?url';

useHead({
  link: [
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
      href: MonaSansUrl,
    },
  ],
}, { mode: 'server' });
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="var(--loading-indicator-color)" />
    <NuxtPage />
  </NuxtLayout>
</template>
