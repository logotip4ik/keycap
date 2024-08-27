<script setup lang="ts">
import { IconBeautifulShape, IconFastShape, IconStarShape } from '#components';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

useServerHead({
  link: [
    { rel: 'preload', as: 'image', href: '/editor-wide.webp', media: '(prefers-color-scheme: light)' },
    { rel: 'preload', as: 'image', href: '/editor-wide-dark.webp', media: '(prefers-color-scheme: dark)' },
  ],
});

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

const { build } = useRuntimeConfig().public;
const editorImgWrapperEl = shallowRef<HTMLDivElement | null>(null);

function animateImgPos(
  end: number,
  movement: number,
) {
  const wrapper = editorImgWrapperEl.value;

  if (!wrapper) {
    return;
  }

  const current = Math.min(1, window.scrollY / end);
  const px = current * movement;

  wrapper.animate([
    { transform: `translateY(${px.toFixed(2)}px)` },
  ], {
    duration: 200,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    fill: 'forwards',
  });
}

onMounted(() => {
  const end = window.innerHeight / 1.5;
  const movement = -50;

  animateImgPos(end, movement);

  if (import.meta.dev) {
    onBeforeUpdate(
      on(window, 'scroll', () => animateImgPos(end, movement)),
    );
  }

  onBeforeUnmount(
    on(window, 'scroll', () => animateImgPos(end, movement)),
  );
});
</script>

<template>
  <div class="index">
    <NavLogin />

    <header class="index__header">
      <p class="index__header__text">
        Beautiful <span class="index__header__text__notes">Notes</span>. <i
          class="font-wide"
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

      <div ref="editorImgWrapperEl" class="index__header__editor__wrapper">
        <LightDarkImg
          light-src="/editor-wide.webp"
          dark-src="/editor-wide-dark.webp"
          alt="editor preview"
          decoding="async"
          width="1980"
          height="780"
          fetchpriority="high"
          class="index__header__editor"
          style="opacity: 0;"
        />
      </div>
    </header>

    <main class="index__main">
      <section id="more" class="index__main__more">
        <ol class="index__main__more__list">
          <li
            v-for="(item, i) in more"
            :key="i"
            class="index__main__more__list__item"
            :style="{ '--grad-start': item.gradient[0], '--grad-stop': item.gradient[1] }"
          >
            <Component :is="item.icon" class="index__main__more__list__item__icon" />

            <p class="index__main__more__list__item__title">
              {{ item.title }}
            </p>

            <p class="index__main__more__list__item__content">
              {{ item.content }}
            </p>
          </li>
        </ol>
      </section>
    </main>

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
      font-size: min(calc(1.5rem + 1.75vw), 3.5rem);
      text-wrap: balance;
      text-align: center;
      line-height: 1.2;
      letter-spacing: -1px;

      max-width: 1200px;

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
        font-size: min(1rem + 0.25vw, 1.25rem);
        font-weight: 500;
        color: var(--text-color);
        text-decoration: none;

        padding: 0.66rem 1.5rem;
        padding: min(0.3rem + 0.5vw, 0.66rem) min(0.75rem + 0.5vw, 1.5rem);

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
        height: 35rem;

        contain: strict;
        perspective: 4000px;
        perspective-origin: 100% 0;
      }
    }
  }

  &__main {
    &__more {
      display: flex;
      justify-content: center;

      padding: 4rem 2rem;

      &__list {
        display: flex;
        justify-content: space-evenly;
        align-items: stretch;
        flex-wrap: wrap;
        gap: 3rem 2rem;

        margin: 0;
        padding: 0;

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

            border-radius: calc(var(--br) + var(--spacing));
            background-image: linear-gradient(to bottom, var(--grad-start), var(--grad-stop));
          }

          &::after {
            filter: blur(16px);
            opacity: 0.175;
          }
        }
      }
    }
  }
}

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

    font-size: min(1.25rem + 0.5vw, 1.75rem);
    text-wrap: nowrap;

    margin: 0;
    opacity: 0.9;

    &__img {
      display: block;

      width: 1.75ch;
      height: auto;

      transform: translateY(1.5%);
    }
  }
}

@keyframes appear {
  from { opacity: 0 }
  to { opacity: 1 }
}
</style>
