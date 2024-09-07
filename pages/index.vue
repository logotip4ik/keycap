<script setup lang="ts">
definePageMeta({
  middleware: ['redirect-dashboard'],
});

useServerHead({
  link: [
    { rel: 'preload', as: 'image', href: '/editor-wide.webp', media: '(prefers-color-scheme: light)' },
    { rel: 'preload', as: 'image', href: '/editor-wide-dark.webp', media: '(prefers-color-scheme: dark)' },
  ],
});
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

<style lang="scss">
</style>
