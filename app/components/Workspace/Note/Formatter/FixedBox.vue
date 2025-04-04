<script setup lang="ts">
import type { Editor } from '@tiptap/core';

defineProps<{
  editor: Editor
}>();

const isFallbackMode = useFallbackMode();
const fixedBoxEl = useTemplateRef('fixedBoxEl');

const hiddenClass = 'inline-menu__hidden';

function handleKeyboardAppear() {
  const viewport = window.visualViewport;

  if (!fixedBoxEl.value || !viewport) {
    return;
  }

  const formatterPosition = window.innerHeight
    - viewport.offsetTop
    - viewport.height;

  fixedBoxEl.value.style.setProperty('bottom', `${formatterPosition}px`);

  requestAnimationFrame(() => {
    fixedBoxEl.value?.classList.remove(hiddenClass);
  });
}

const debouncedKeyboardAppear = debounce(handleKeyboardAppear, 100, { trailing: true });

function handleMobileScroll() {
  fixedBoxEl.value?.classList.add(hiddenClass);

  requestAnimationFrame(() => {
    debouncedKeyboardAppear();
  });
}

if (import.meta.client && window.visualViewport != null) {
  const cleanups = [
    on(window.visualViewport, 'resize', debouncedKeyboardAppear),
    on(window.visualViewport, 'scroll', handleMobileScroll),
  ];

  onBeforeUnmount(() => {
    invokeArrayFns(cleanups);
    cleanups.length = 0;
  });
};
</script>

<template>
  <WithFadeTransition appear>
    <div v-show="!isFallbackMode" ref="fixedBoxEl" class="inline-menu formatter">
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
  bottom: 0;
  left: 0;
  z-index: 10;

  padding:
    0.325rem
    calc(0.75rem + env(safe-area-inset-right))
    max(0.375rem, env(safe-area-inset-bottom))
    calc(0.75rem + env(safe-area-inset-left))
  ;

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
