<script setup lang="ts">
const { build } = useRuntimeConfig().public;
</script>

<template>
  <footer class="footer font-wide">
    <div class="footer__wrapper">
      <div class="footer__row">
        <p class="footer__title">
          <img
            src="/logo.webp"
            alt="purple keycap"
            class="footer__title__img"
            decoding="async"
            width="48"
            height="48"
            fetchpriority="low"
            loading="lazy"
          >
          Keycap © 2024
        </p>

        <p class="footer__version">
          {{ build.version }}
        </p>
      </div>

      <div class="footer__row">
        <p />
        <p class="footer__headline">
          Built to be used 💜
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding-top: 4rem;

  &__wrapper {
    display: flex;
    flex-direction: column;

    width: 93vw;
    max-width: 1200px;

    padding: 4rem 2rem;

    border: 1px solid var(--task-list-indicator-color);
    border-bottom-width: 0;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background-color: hsla(var(--text-color-hsl), 0.025);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;

    & + & {
      margin-top: 0.5rem;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }

  &__version,
  &__headline {
    text-wrap: nowrap;

    margin: 0;

    opacity: 0.7;
  }

  &__title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5ch;

    font-size: min(1rem + 1vw, 1.75rem);
    text-wrap: nowrap;

    margin: 0;
    opacity: 0.9;

    &__img {
      display: block;

      width: 1.75ch;
      height: auto;

      transform: translateY(1.5%);
    }

    @media screen and (max-width: $breakpoint-tablet) {
      font-size: calc(min(1rem + 1vw, 1.75rem) * 1.25);
    }
  }
}
</style>
