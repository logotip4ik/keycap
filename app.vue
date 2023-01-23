<script setup>
import requrl from 'requrl';

import MonaSansUrl from '~/assets/fonts/Mona-Sans/Mona-Sans.woff2';

if (process.server) {
  const event = useRequestEvent();

  const base = requrl(event.node.req);

  useHead({
    link: [
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
        href: `${base}${MonaSansUrl}`,
      },
    ],
  });
}
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="var(--loading-indicator-color)" />
    <NuxtPage />
  </NuxtLayout>
</template>
