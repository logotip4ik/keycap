<script setup>
useHead({
  link: [
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
      href: import('~/assets/fonts/Mona-Sans/Mona-Sans.woff2?url').then((value) => value.default),
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
