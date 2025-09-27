<script setup lang="ts">
import type { Editor } from '@tiptap/core';

defineProps<{
  editor: Editor
}>();

const isFallbackMode = useFallbackMode();
const fixedBoxEl = useTemplateRef('fixedBoxEl');

const isKeyboardShown = ref(false);

function moveFormatterAboveKeyboard() {
  const viewport = window.visualViewport;
  const el = fixedBoxEl.value;

  if (!el || !viewport) {
    return;
  }

  const formatterPosition = window.innerHeight
    - viewport.offsetTop
    - viewport.height;

  el.style.setProperty('bottom', `${formatterPosition.toFixed(2)}px`);
  isKeyboardShown.value = viewport.height + 30 < window.innerHeight;
}

if (import.meta.client && window.visualViewport != null) {
  onMounted(moveFormatterAboveKeyboard);

  const cleanups = [
    on(window.visualViewport, 'resize', moveFormatterAboveKeyboard),
    on(window.visualViewport, 'scroll', moveFormatterAboveKeyboard),
  ];

  onBeforeUnmount(() => {
    invokeArrayFns(cleanups);
    cleanups.length = 0;
  });
};
</script>

<template>
  <WithFadeTransition appear>
    <div
      v-show="!isFallbackMode"
      ref="fixedBoxEl"
      class="inline-menu formatter"
      :class="{ 'inline-menu__keyboard-shown': isKeyboardShown }"
    >
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
  bottom: env(safe-area-inset-bottom, 0px);
  left: 0;
  z-index: 10;

  padding:
    0.375rem
    calc(0.75rem + env(safe-area-inset-right))
    calc(0.375rem + env(safe-area-inset-bottom))
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

  transition: padding .1s;

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
  }

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.25);

    backdrop-filter: blur(12px);
  }

  &__keyboard-shown {
    padding-bottom: 0.375rem;
  }

  &.fade-enter-active {
    transition-delay: 0.35s;
  }
}
</style>
