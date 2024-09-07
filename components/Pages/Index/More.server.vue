<script setup lang="ts">
import { IconBeautifulShape, IconFastShape, IconStarShape } from '#components';

const more = [
  {
    icon: IconStarShape,
    title: 'Crafted to be simple',
    content: 'Available on every device the moment you type. Create note or folder in 1 click. Public link to note with 2 clicks.',
    gradient: ['#DF99F7', '#FFDBB0'],
  },
  {
    icon: IconFastShape,
    title: 'Tuned to be fast',
    content: 'Avarage response time for api\'s are under 100ms. Built with Nitro and Nuxt.',
    gradient: ['#FFD9A0', '#FFF5F1'],
  },
  {
    icon: IconBeautifulShape,
    title: 'Designed to be beautiful',
    content: 'Every component is designed and crafted by hand with perfection in mind.',
    gradient: ['#A7B5FF', '#F3ACFF'],
  },
];
</script>

<template>
  <section class="main__more">
    <ol class="main__more__list">
      <li
        v-for="(item, i) in more"
        :key="i"
        class="main__more__list__item"
        :style="{ '--grad-start': item.gradient[0], '--grad-stop': item.gradient[1] }"
      >
        <Component :is="item.icon" class="main__more__list__item__icon" />

        <p class="main__more__list__item__title">
          {{ item.title }}
        </p>

        <p class="main__more__list__item__content">
          {{ item.content }}
        </p>
      </li>
    </ol>
  </section>
</template>

<style lang="scss">
.main__more {
  display: flex;
  justify-content: center;

  padding: 4rem 2rem;

  &__list {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 3rem 2rem;
    flex: 1;

    margin: 0;
    padding: 0;

    max-width: 1200px;

    list-style-type: none;

    &__item {
      --br: 0.5rem;

      position: relative;

      width: 95vw;
      max-width: 325px;

      padding: 4ch 2ch;

      border-radius: var(--br);
      background-color: var(--surface-color);

      &__icon {
        display: block;

        width: 33%;
        height: auto;
      }

      &__title {
        font-size: min(1rem + 1vw, 1.75rem);
        line-height: 1.1;

        margin: 1.5rem 0;
      }

      &__content {
        opacity: 0.85;

        margin: 0;
      }

      &::after,
      &::before {
        --spacing: 0.125rem;

        content: '';

        position: absolute;
        inset: calc(-1 * var(--spacing));
        z-index: -1;

        opacity: 0.75;
        border-radius: calc(var(--br) + var(--spacing));
        background-image: linear-gradient(to bottom, var(--grad-start), var(--grad-stop));

        transition: opacity 0.25s ease-out;
      }

      &::after {
        filter: blur(16px);
        opacity: 0.175;
      }

      &:hover {
        &::before {
          opacity: 1;
        }

        &::after {
          opacity: 0.25;
        }
      }
    }
  }
}
</style>
