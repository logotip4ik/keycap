<script setup lang="ts">
definePageMeta({
  middleware: ['redirect-dashboard'],
});

if (import.meta.server) {
  useHead({
    link: [
      { rel: 'preload', as: 'image', href: '/images/editor-wide.webp', media: '(prefers-color-scheme: light)' },
      { rel: 'preload', as: 'image', href: '/images/editor-wide-dark.webp', media: '(prefers-color-scheme: dark)' },
    ],
  });
}
</script>

<template>
  <div class="index">
    <NavLogin />

    <PagesIndexHeader />

    <main class="index__main">
      <PagesIndexWhy />

      <PagesIndexMore />
    </main>

    <PagesIndexFooter />
  </div>
</template>
