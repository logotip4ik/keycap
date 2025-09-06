<script setup lang="ts">
const editorImgWrapperEl = useTemplateRef('editorImgWrapperEl');

const wordsSettings: Record<string, { tag?: string, class: string }> = {
  'Notes.': { class: 'header__text__notes' },
  'Fast,': { tag: 'i', class: 'font-wide' },
  'purple.': { class: 'header__text__purple' },
};
const text = 'Beautiful Notes. Fast, simple, shareable, synced between devices and purple.'
  .split(' ')
  .map((word) => {
    const setting = wordsSettings[word];
    return {
      word,
      tag: setting?.tag || 'span',
      class: setting?.class,
    };
  });

function animateImgPos(end: number, movement: number) {
  const wrapper = editorImgWrapperEl.value;

  if (!wrapper) {
    return;
  }

  const current = Math.min(1, window.scrollY / end);
  const px = current * movement;

  wrapper.animate([
    { transform: `translateY(${px.toFixed(2)}px)` },
  ], {
    duration: 1000,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    fill: 'forwards',
  });
}

const offs: Array<() => void> = [];
onMounted(() => {
  const end = window.innerHeight / 1.5;
  const movement = -50;

  animateImgPos(end, movement);

  offs.push(
    on(window, 'scroll', () => animateImgPos(end, movement)),
  );
});

onBeforeUnmount(() => {
  invokeArrayFns(offs);
  offs.length = 0;
});

if (import.meta.dev) {
  onBeforeUpdate(() => {
    invokeArrayFns(offs);
    offs.length = 0;
  });
}
</script>

<template>
  <header class="header">
    <PagesIndexGodRay />

    <p class="header__text">
      <template v-for="(item, i) in text" :key="i">
        <Component :is="item.tag" :class="item.class" class="header__text__word" :style="{ '--i': i, 'opacity': 0 }">
          {{ item.word }}
        </Component>
        <template v-if="i !== text.length - 1">
          {{ ' ' }}
        </template>
      </template>
    </p>

    <div class="header__buttons">
      <NuxtLink
        href="/register"
        class="header__buttons__button header__buttons__button--start"
        style="opacity: 0;"
      >
        Start Keycaping
      </NuxtLink>

      <NuxtLink
        href="#more"
        class="header__buttons__button header__buttons__button--more"
        style="opacity: 0;"
      >
        More
      </NuxtLink>
    </div>

    <div ref="editorImgWrapperEl" class="header__editor__wrapper">
      <LightDarkImg
        light-src="/images/editor-wide.webp"
        dark-src="/images/editor-wide-dark.webp"
        alt="editor preview"
        decoding="async"
        width="1980"
        height="780"
        fetchpriority="high"
        class="header__editor"
        style="opacity: 0;"
      />
    </div>
  </header>
</template>

<style lang="scss">
.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 32.5svh 1.75rem 0;

  &__text {
    color: hsla(var(--text-color-hsl), 0.9);
    font-size: min(calc(1.5rem + 2.75vw), 3.5rem);
    text-wrap: balance;
    text-align: center;
    line-height: 1.2;
    letter-spacing: -1px;

    max-width: 35ch;

    mix-blend-mode: multiply;

    @media (prefers-color-scheme: dark) {
      mix-blend-mode: difference;
    }

    &__purple {
      font-weight: 600;
      font-feature-settings: "ccmp", "ss03";
      color: var(--task-list-indicator-color);

      @media (prefers-color-scheme: dark) {
        color: var(--selection-bg-color);
      }
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

    &__word {
      animation: appear 0.825s calc(var(--i) * 0.0825s) forwards !important;
    }
  }

  &__buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;

    transform: translateX(-0.5rem);

    &__button {
      font-size: min(1rem + 0.25vw, 1.25rem);
      font-weight: 500;
      color: var(--text-color);
      text-decoration: none;

      padding: min(0.3rem + 0.5vw, 0.66rem) min(1rem + 0.5vw, 1.5rem);

      border-radius: 0.175rem;

      animation: appear 0.75s 0.75s forwards !important;

      &+& {
        animation-delay: 0.9s !important;
      }

      &--start {
        color: white;
        background-color: hsla(var(--task-list-indicator-color-hsl), 0.9);

        transition: background-color .3s, box-shadow .3s;

        &:is(:hover, :focus) {
          background-color: var(--task-list-indicator-color);
          box-shadow: 0 0 1rem hsla(var(--selection-bg-color-hsl), 0.50);

          transition-duration: .1s;

          @media (prefers-color-scheme: dark) {
            background-color: hsla(var(--selection-bg-color-hsl), 0.9);
          }
        }

        @media (prefers-color-scheme: dark) {
          background-color: hsla(var(--selection-bg-color-hsl), 0.9);
        }
      }

      &--more {
        transition: background-color .3s, filter .3s;

        &:is(:hover, :focus) {
          background-color: hsla(var(--text-color-hsl), 0.1);
          box-shadow: 0 0 1rem hsla(var(--text-color-hsl), 0.05);

          transition-duration: .1s;
        }
      }

      @media screen and (max-width: $breakpoint-tablet) {
        padding: 0.75rem 1.75rem;
      }
    }
  }

  &__editor {
    --scale: 1.2;
    --translate: -5%, 3%;

    display: block;

    width: 100%;
    height: auto;

    padding-top: 5rem;

    pointer-events: none;
    user-select: none;
    contain: strict;
    mask-image: linear-gradient(to bottom, black, rgba(0, 0, 0, 0) 90%);

    transform: translate(var(--translate)) scale(var(--scale)) rotateX(50deg) rotateY(30deg) rotate(325deg);
    transform-origin: top left;
    animation:
      land 1s 1.25s forwards cubic-bezier(0.16, 1, 0.3, 1),
      appear 1s 1.25s forwards !important;

    &__wrapper {
      position: relative;
      z-index: -2;

      width: min(1500px, 95vw);
      height: min(35rem, 10rem + 23vw);

      contain: strict;
      perspective: 4000px;
      perspective-origin: 100% 0;

      mix-blend-mode: darken;

      @media screen and (max-width: $breakpoint-tablet) {
        height: calc(15rem + 20vw);
      }

      @media (prefers-color-scheme: dark) {
        mix-blend-mode: lighten;
      }
    }

    @media screen and (max-width: $breakpoint-tablet) {
      --scale: 1.6;
      --translate: -25%, 2%;

      animation:
        mobileLand 1s 1.25s forwards cubic-bezier(0.16, 1, 0.3, 1),
        appear 1s 1.25s forwards !important;
    }
  }
}

@keyframes land {
  from {
    scale: 1.2;
    translate: 5vw -5vh;
  }

  to {
    scale: 1;
    translate: 0;
  }
}

@keyframes mobileLand {
  from {
    scale: 2;
    translate: 20vw -30vh;
  }

  to {
    scale: 1;
    translate: 0;
  }
}

@keyframes appear {
  from {
    opacity: 0;
    filter: blur(12px);
  }

  to {
    opacity: 1;
    filter: blur(0px);
  }
}
</style>
