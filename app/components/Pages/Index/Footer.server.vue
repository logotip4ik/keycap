<script setup lang="ts">
const { build, site } = useRuntimeConfig().public;

const links = [
  { name: 'Email', href: `mailto:contact@${site}` },
  { name: '@KeycapTheNotes', href: 'https://x.com/KeycapTheNotes' },
];
</script>

<template>
  <footer class="footer font-wide">
    <div class="footer__wrapper">
      <div class="footer__row">
        <p class="footer__title">
          <img
            src="/images/logo.webp"
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
        <ul class="footer__links">
          <li v-for="item in links" :key="item.href" class="footer__links__item">
            <NuxtLink class="footer__links__item__link" :href="item.href" target="_blank">
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>

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
    box-shadow: 0 0 1rem hsla(var(--task-list-indicator-color-hsl), 0.175);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;

    & + & {
      margin-top: 0.75rem;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      text-align: center;
    }
  }

  &__version,
  &__headline {
    text-wrap: nowrap;

    margin: 0;

    opacity: 0.7;
  }

  &__version {
    font-size: calc(min(1rem + 1vw, 1.75rem) / 1.33);
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

  &__links {
    margin: 0;
    padding: 0;

    list-style-type: none;

    &__item {
      &__link {
        color: hsla(var(--text-color-hsl), 0.75);
        text-decoration: none;
        filter: none;

        transition: filter .3s, color .3s;

        &:is(:hover, :focus) {
          color: var(--text-color);
          filter: drop-shadow(0 0 1rem hsla(var(--text-color-hsl), 0.5));
          text-decoration: underline;

          transition-duration: .1s;
        }
      }
    }
  }
}
</style>
