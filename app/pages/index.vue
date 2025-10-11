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

const demoEditorContent = [
  '<h2>Hey! Try editing me</h2>',
  '<blockquote>we have commands - / and emojies - :key</blockquote>',
].join('');
</script>

<template>
  <div class="index">
    <NavLogin />

    <PagesIndexHeader />

    <main class="index__main">
      <LazyPagesIndexWhy hydrate-on-visible />

      <Suspense suspensible>
        <LazyClientOnly hydrate-on-idle>
          <LazyPagesIndexEditorDemo :content="demoEditorContent" />
        </LazyClientOnly>
      </Suspense>

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
    transform: translate3d(0,0,0) translateY(2rem);
  }

  to {
    opacity: 1;
    transform: translate3d(0,0,0);
  }
}
</style>
