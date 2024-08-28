<script setup lang="ts">
const editorImgWrapperEl = shallowRef<HTMLDivElement | null>(null);

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
  <header class="header">
    <p class="header__text">
      Beautiful <span class="header__text__notes">Notes</span>. <i
        class="font-wide"
      >Fast</i>, simple, shareable, synced between devices and
      <span class="header__text__purple">purple.</span>
    </p>

    <div class="header__buttons">
      <NuxtLink href="/register" class="header__buttons__button header__buttons__start">
        Start Keycaping
      </NuxtLink>

      <NuxtLink href="#more" class="header__buttons__button header__buttons__more">
        More
      </NuxtLink>
    </div>

    <div ref="editorImgWrapperEl" class="header__editor__wrapper">
      <LightDarkImg
        light-src="/editor-wide.webp"
        dark-src="/editor-wide-dark.webp"
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
    --scale: 1.2;
    --translate: -5%, 3%;

    display: block;

    width: 100%;
    height: auto;

    padding-top: 5rem;

    pointer-events: none;
    user-select: none;
    contain: strict;
    mask-image: linear-gradient(to bottom, black, rgba(0,0,0,0) 90%);

    transform: translate(var(--translate)) scale(var(--scale)) rotateX(50deg) rotateY(30deg) rotate(325deg);
    transform-origin: top left;
    backface-visibility: hidden;
    animation: appear 0.5s 0.5s forwards !important;

    &__wrapper {
      position: relative;
      z-index: -2;

      width: min(1500px, 95vw);
      height: min(35rem, 10rem + 23vw);

      contain: strict;
      perspective: 4000px;
      perspective-origin: 100% 0;

      @media screen and (max-width: $breakpoint-tablet) {
        height: calc(15rem + 20vw);
      }
    }

    @media screen and (max-width: $breakpoint-tablet) {
      --scale: 1.6;
      --translate: -25%, 2%;
    }
  }
}

@keyframes appear {
  from { opacity: 0 }
  to { opacity: 1 }
}
</style>
