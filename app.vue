<script setup lang="ts">
import '~/polyfills/array-at';
import 'requestidlecallback-polyfill';

import parseDuration from 'parse-duration';

import breakpoints from 'assets/constants/breakpoints';

const { width: windowWidth } = useWindowSize();

// NOTE: should be removed from client bundle
const device = process.server ? parseUA(useRequestHeaders()['user-agent']) : undefined;

const isFirefox = process.server
  ? device!.isFirefox
  : checkIsFirefox(navigator.userAgent);

const isSmallScreen = computed(() =>
  process.server
    ? device!.isMobileOrTablet
    : windowWidth.value < breakpoints.tablet,
);
provide(IsSmallScreenKey, isSmallScreen);

useHead({
  titleTemplate: (title) => title ? `${title} - Keycap` : 'Keycap - Better notes',
  htmlAttrs: {
    class: {
      'firefox': isFirefox,
      'phone-or-tablet': isSmallScreen.value,
    },
  },
});

if (process.client) {
  const UPDATE_WORKER_DELAY = parseDuration('1.5s')!;

  setTimeout(() => {
    requestIdleCallback(async () => {
      const { updateServiceWorker } = await import('~/utils/sw-controller');

      requestIdleCallback(updateServiceWorker);
    });
  }, UPDATE_WORKER_DELAY);
}

if (process.server) {
  useSeoMeta({
    ogDescription: 'Another note taking webapp ❤.Simple, fast and purple.',
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

  <ClientOnly>
    <LazyWorkspaceToasts />
  </ClientOnly>
</template>
