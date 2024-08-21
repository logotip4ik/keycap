<script setup lang="ts">
definePageMeta({
  middleware: ['redirect-dashboard'],
});

useHead({
  link: [
    { rel: 'preload', as: 'image', href: '/editor-wide.webp', media: '(prefers-color-scheme: light)' },
    { rel: 'preload', as: 'image', href: '/editor-wide-dark.webp', media: '(prefers-color-scheme: dark)' },
  ],
});
</script>

<template>
  <div class="index">
    <NavLogin />

    <header class="index__header">
      <p class="index__header__text">
        Beautiful <span class="index__header__text__notes">Notes</span>. <i
          class="index__header__text__fast font-wide"
        >Fast</i>, simple, shareable, synced between devices and
        <span class="index__header__text__purple">purple.</span>
      </p>

      <div class="index__header__buttons">
        <NuxtLink href="/register" class="index__header__buttons__button index__header__buttons__start">
          Start Keycaping
        </NuxtLink>

        <NuxtLink href="#more" class="index__header__buttons__button index__header__buttons__more">
          More
        </NuxtLink>
      </div>

      <div class="index__header__editor__wrapper">
        <LightDarkImg
          light-src="/editor-wide.webp"
          dark-src="/editor-wide-dark.webp"
          alt="editor preview"
          decoding="async"
          width="1980"
          height="780"
          fetchpriority="high"
          class="index__header__editor"
        />
      </div>
    </header>
    <main class="index__main" />
  </div>
</template>

<style lang="scss">
.index {
  &__header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 32.5svh 1rem 0;

    &__text {
      color: hsla(var(--text-color-hsl), 0.9);
      font-size: calc(1.5rem + 1.75vw);
      text-wrap: balance;
      text-align: center;
      line-height: 1.2;
      letter-spacing: -1px;

      max-width: 1200px;

      &__fast {
        font-feature-settings: "ss02" on;
      }

      &__purple {
        font-weight: 600;
        font-feature-settings: "ccmp", "ss03";
        color: var(--selection-bg-color);
      }

      &__notes {
        position: relative;
        color: var(--text-color);

        &::after {
          content: '';

          position: absolute;
          top: 50%;
          left: 50%;
          z-index: -1;

          width: 130%;
          height: 110%;

          background-color: var(--selection-bg-color);
          opacity: 0.5;
          border-radius: 35%;

          filter: blur(16px);
          transform: translate(-50%, -50%);
        }
      }
    }

    &__buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.25rem;

      &__button {
        font-size: min(calc(1rem + 0.25vw), 1.25rem);
        font-weight: 500;
        color: var(--text-color);
        text-decoration: none;

        padding: 0.66rem 1.5rem;
        padding: min(calc(0.3rem + 0.5vw), 0.66rem) min(calc(0.75rem + 0.5vw), 1.5rem);

        border-radius: 0.175rem;
      }

      &__start {
        color: white;
        background-color: var(--task-list-indicator-color);
        filter: drop-shadow(0 0 1rem hsla(var(--selection-bg-color-hsl), 0.25));
      }
    }

    &__editor {
      display: block;

      width: 100%;
      height: auto;

      padding-top: 5rem;

      pointer-events: none;
      user-select: none;
      contain: strict;
      mask-image: linear-gradient(to bottom, black, rgba(0,0,0,0) 90%);

      transform: translate(-5%, 3%) scale(1.2) rotateX(50deg) rotateY(30deg) rotate(325deg);
      transform-origin: top left;
      backface-visibility: hidden;
      animation: appear 0.5s 0.5s forwards !important;

      &__wrapper {
        position: relative;
        z-index: -2;

        width: min(1500px, 95vw);
        height: 33rem;

        contain: strict;
        perspective: 4000px;
        perspective-origin: 100% 0;
      }
    }
  }

  &__main {
    height: 500vh;
  }
}

@keyframes appear {
  from { opacity: 0 }
  to { opacity: 1 }
}
</style>
