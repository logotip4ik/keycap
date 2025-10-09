<script setup lang="ts">
const cardsWrapperEl = useTemplateRef('cardsWrapperEl');

const { intersecting: isCardsVisible } = useIntersectionObserver(cardsWrapperEl, { once: true });

interface Card {
  icon: IconName
  title: string
  content: string
  gradient: [string, string]
}

const more: Array<Card> = [
  {
    icon: 'star-shape',
    title: 'Crafted to be simple',
    content: 'Available on every device the moment you type. Create note or folder in 1 click. Public link to note with 2 clicks.',
    gradient: ['#DF99F7', '#FFDBB0'],
  },
  {
    icon: 'fast-shape',
    title: 'Tuned to be fast',
    content: 'Avarage response time for api\'s are under 100ms. Built with Nitro and Nuxt.',
    gradient: ['#FFD9A0', '#FFF5F1'],
  },
  {
    icon: 'beautiful-shape',
    title: 'Designed to be beautiful',
    content: 'Every component is designed and crafted by hand with perfection in mind.',
    gradient: ['#A7B5FF', '#F3ACFF'],
  },
];
</script>

<template>
  <section class="main__more">
    <ol ref="cardsWrapperEl" class="main__more__list">
      <li
        v-for="(item, i) in more"
        :key="i"
        class="main__more__list__item"
        :class="isCardsVisible && 'animate-in'"
        :style="{
          '--grad-start': item.gradient[0],
          '--grad-stop': item.gradient[1],
          '--stagger': i,
        }"
      >
        <div class="main__more__list__item__wrapper">
          <Icon :name="item.icon" class="main__more__list__item__icon" />

          <p class="main__more__list__item__title">
            {{ item.title }}
          </p>

          <p class="main__more__list__item__content">
            {{ item.content }}
          </p>
        </div>
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
      --spacing: 0.125rem;
      --bg: linear-gradient(to bottom, var(--grad-start), var(--grad-stop));

      display: flex;
      justify-content: center;
      align-items: stretch;

      position: relative;

      width: 95vw;
      max-width: 325px;

      padding: var(--spacing);
      border-radius: var(--br);

      background-image: var(--bg);

      opacity: 0;

      &__wrapper {
        padding: 4ch 2ch;

        border-radius: calc(var(--br) - var(--spacing));
        background-color: var(--surface-color);
      }

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
      }

      &::after {
        content: '';

        position: absolute;
        inset: 0;
        z-index: -1;

        opacity: 0.025;
        filter: blur(16px);
        border-radius: inherit;
        background-image: var(--bg);

        transition: opacity 0.25s ease-out;
      }

      &:hover::after {
        opacity: 0.125;
      }
    }
  }
}
</style>
