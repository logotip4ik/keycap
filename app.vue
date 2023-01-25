<script setup>
import MonaSansUrl from '~/assets/fonts/Mona-Sans/Mona-Sans.woff2';

const localhost = 'localhost:3000';
const base = process.env.SITE_ORIGIN || localhost;
const protocol = base === localhost ? 'http://' : 'https://';

useHead({
  link: [
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
      href: `${protocol}${base}${MonaSansUrl}`,
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
