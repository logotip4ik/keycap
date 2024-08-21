<script setup lang="ts">
definePageMeta({
  middleware: ['redirect-dashboard'],
});

const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
</script>

<!--
  <div class="index">
    TODO: actually craft landing page

    <NavLogin />

    <PagesIndexHero />

    <PagesIndexBuildInfo />
  </div>
-->

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
        <img
          :src=" `/editor-wide${prefersDarkMode ? '-dark' : ''}.png`"
          alt="editor preview"
          decoding="async"
          width="1980"
          height="780"
          fetchpriority="high"
          class="index__header__editor"
        >
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

          width: 120%;
          height: 100%;

          background-color: var(--selection-bg-color);
          opacity: 0.5;
          border-radius: 25%;

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
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--text-color);
        text-decoration: none;

        padding: 0.66rem 1.5rem;

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

      padding-top: 10rem;

      pointer-events: none;
      user-select: none;
      contain: strict;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0) 90%);

      transform: translate(-4%, 3%) scale(1.2) rotateX(47deg) rotateY(31deg) rotate(324deg);
      transform-origin: top left;
      backface-visibility: hidden;

      &__wrapper {
        position: relative;
        z-index: -2;

        width: min(1400px, 95vw);
        height: 40rem;

        contain: strict;
        perspective: 4000px;
        perspective-origin: 100% 0;
        transform-style: preserve-3d;
      }
    }
  }

  &__main {
    height:  500vh;
  }
}
</style>

<!-- <style lang="scss">
.index {
  min-height: 100vh;
  min-height: 100svh;

  overflow: hidden;

  .container {
    width: 92.5%;
    max-width: 1300px;

    margin: 0 auto;
  }

  &__header {
    position: relative;
    z-index: 0;

    width: 100%;
    max-width: 1100px;

    margin: 0 auto;
    padding-top: 30vh;
    padding-top: 30svh;

    &__alert {
      display: inline-block;

      color: hsla(var(--text-color-hsl), 0.8);

      padding: 0.5rem 0.75rem;
      margin-bottom: 0.5rem;

      border-radius: 0.25rem;
      border: 1px solid hsla(var(--selection-bg-color-hsl), 0.5);
      background-color: hsla(var(--selection-bg-color-hsl), 0.125);

      @media (prefers-color-scheme: dark) {
        background-color: hsla(var(--selection-bg-color-hsl), 0.25);
      }

      &__icon {
        margin-right: 0.25rem;

        vertical-align: baseline  !important;

        transform: translateY(1.5px);
      }
    }

    &__title {
      font-size: max(5vw, 5rem);

      margin: 0;
      margin-bottom: 1.5rem;

      @media (max-width: $breakpoint-tablet) {
        font-size: max(5vw, 4rem);
      }
    }

    &__subtitle {
      font-size: 1rem;
      line-height: 1.5;
      color: hsla(var(--text-color-hsl), 0.75);

      max-width: 44ch;
    }
  }

  &__build-info {
    position: absolute;
    bottom: 0.5rem;
    left: 50%;

    font-size: 0.9rem;
    text-align: center;
    line-height: 1.5;

    opacity: 0.5;
    transform: translate(-50%, 0);

    &__commit-link {
      font-family: monospace;
      color: currentColor;
      text-decoration: none;

      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      background-color: hsla(var(--selection-bg-color-hsl), 0.25)
    }
  }
}
</style> -->
