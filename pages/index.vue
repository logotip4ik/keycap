<script setup lang="ts">
definePageMeta({
  middleware: ['redirect-dashboard'],
});
</script>

<template>
  <div class="index">
    <!-- TODO: actually craft landing page -->

    <NavLogin />

    <PagesIndexHero />

    <PagesIndexBuildInfo />
  </div>
</template>

<style lang="scss">
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
</style>
