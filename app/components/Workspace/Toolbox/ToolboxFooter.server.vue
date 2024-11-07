<script setup lang="ts">
const { build } = useRuntimeConfig().public;

const links = [
  { href: '/logout', name: 'Log Out' },
  { href: 'https://github.com/logotip4ik/keycap', name: 'GitHub' },
  { href: 'https://bogdankostyuk.xyz', name: 'Author' },
  { href: 'mailto:contact@bogdankostyuk.xyz', name: 'Contact Us' },
];

function isRelative(url: string) {
  // also could check for same window.location.origin
  return url[0] === '/';
}
</script>

<template>
  <footer class="toolbox__footer">
    <p class="toolbox__footer__title font-wide">
      <img
        src="/logo.webp"
        alt="purple keycap"
        class="toolbox__footer__title__img"
        decoding="async"
        width="48"
        height="48"
        fetchpriority="low"
        loading="lazy"
      >
      Keycap © 2024 <span class="toolbox__footer__title__version">{{ build.version }}</span>
    </p>

    <ul class="toolbox__footer__links">
      <li
        v-for="(link, idx) in links"
        :key="idx"
        class="toolbox__footer__links__item"
      >
        <NuxtLink
          :href="link.href"
          :target="isRelative(link.href) ? '_self' : '_blank'"
          external
          class="toolbox__footer__links__item__link"
        >
          {{ link.name }}
        </NuxtLink>
      </li>
    </ul>
  </footer>
</template>

<style lang="scss">
.toolbox__footer {
  --spacing: 1ch;

  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;

  margin-top: calc(var(--pd-y) * 0.75);

  &__title {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    font-size: 0.925rem;
    font-weight: 300;
    color: hsla(var(--text-color-hsl), 0.65);

    margin: 0;
    padding-left: calc(var(--pd-x) / 5);

    &__img {
      display: block;

      width: 1.5rem;
      height: auto;

      margin-right: calc(var(--spacing) / 1.5);

      opacity: 0.65;

      transform: translateY(-2%);
    }

    &__version {
      margin-left: auto;
    }
  }

  &__links {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 0.925rem;
    font-weight: 300;

    margin: calc(var(--spacing) * 1.33) 0 0;
    padding: 0;

    list-style-type: none;

    &__item {
      &__link {
        color: hsla(var(--text-color-hsl), 0.75);

        text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
        text-underline-offset: 3px;

        cursor: pointer;
        border: none;
        background-color: transparent;
        transition: color var(--sidebar-tr-duration);

        @media (hover: hover) {
          color: hsla(var(--text-color-hsl), 0.65);
        }

        &:is(:hover, :focus-visible) {
          color: var(--text-color);

          transition-duration: 0.1s;
        }

        &:focus-visible {
          outline: 2px solid hsla(var(--selection-bg-color-hsl), 1);
          outline-offset: 1px;
        }
      }
    }
  }
}
</style>
