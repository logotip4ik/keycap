<script setup lang="ts">
definePageMeta({
  middleware: ['redirect-dashboard'],
});

const demoEditorContent = [
  '<h2>Hey! Try editing me</h2>',
  '<blockquote>we have commands - / and emojies - :key</blockquote>',
].join('');

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
      <LazyPagesIndexWhy hydrate-on-visible />

      <ClientOnly>
        <LazyPagesIndexEditorDemo
          hydrate-on-visible
          :content="demoEditorContent"
        />
      </ClientOnly>

      <LazyPagesIndexMore hydrate-on-visible />
    </main>

    <LazyPagesIndexFooter />
  </div>
</template>

<style lang="scss">
.animate-in {
  animation: appear 1s calc(var(--stagger, 0) * 0.05s) forwards cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes appear {
  from {
    opacity: 0;
    filter: blur(12px);
    transform: translate3d(0,0,0);
  }

  to {
    opacity: 1;
    transform: translate3d(0,0,0);
  }
}
</style>
