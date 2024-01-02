<script setup lang="ts">
import type { Editor } from '@tiptap/core';

defineProps<{
  editor: Editor
}>();

const isFallbackMode = useFallbackMode();
const fixedBox = shallowRef<HTMLElement | null>(null);

const hiddenClass = 'inline-menu__hidden';

let prevFormatterPosition: number = 0;
let prevAnimation: Animation | null;
function handleKeyboardAppear() {
  const viewport = window.visualViewport;

  if (!fixedBox.value || !viewport || prevAnimation)
    return;

  const formatterPosition = window.innerHeight
    - viewport.offsetTop
    - viewport.height;

  prevAnimation = fixedBox.value.animate([
    { transform: `translate3d(0,${-1 * prevFormatterPosition}px,0)` },
    { transform: `translate3d(0,${-1 * formatterPosition}px,0)` },
  ], { fill: 'forwards', duration: 100, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });

  prevAnimation.addEventListener('finish', () => {
    fixedBox.value?.classList.remove(hiddenClass);
    prevAnimation = null;
    prevFormatterPosition = formatterPosition;
  });
}

const debouncedKeyboardAppear = debounce(handleKeyboardAppear, 75);

function handleMobileScroll() {
  fixedBox.value?.classList.add(hiddenClass);

  debouncedKeyboardAppear();
}

if (import.meta.client) {
  const cleanups = [
    on(window.visualViewport!, 'resize', debouncedKeyboardAppear),
    on(window.visualViewport!, 'scroll', handleMobileScroll),
  ];

  onBeforeUnmount(() => {
    invokeArrayFns(cleanups);
    cleanups.length = 0;
  });
};
</script>

<template>
  <WithFadeTransition appear>
    <div v-show="!isFallbackMode" ref="fixedBox" class="inline-menu formatter">
      <slot />
    </div>
  </WithFadeTransition>
</template>

<style lang="scss">
.inline-menu {
  --base-shadow-color: 0, 0, 0;

  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  bottom: 0px;
  left: 0;
  z-index: 10;

  padding: 0.325rem;

  width: 100%;

  border-top: 1px solid hsla(var(--text-color-hsl), 0.25);
  background-color: hsla(var(--surface-color-hsl), 0.95);
  box-shadow:
    1px 1.7px 5.3px rgba(var(--base-shadow-color), 0.032),
    3.4px 5.6px 17.9px rgba(var(--base-shadow-color), 0.048),
    15px 25px 80px rgba(var(--base-shadow-color), 0.08)
  ;

  transition: opacity .3s;

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
  }

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.25);

    backdrop-filter: blur(12px);
  }

  &__hidden {
    opacity: 0;
    pointer-events: none;

    transition: opacity .1s;
  }

  &.fade-enter-active {
    transition-delay: 0.35s;
  }
}
</style>
