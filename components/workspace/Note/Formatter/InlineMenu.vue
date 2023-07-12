<script setup lang="ts">
import type { Editor } from '@tiptap/core';

interface Props { editor: Editor }
defineProps<Props>();

const isFallbackMode = useFallbackMode();
const inlineMenu = ref<HTMLElement | null>(null);

let prevFormatterPosition: number;
function handleKeyboardAppear() {
  const viewport = window.visualViewport;

  if (!inlineMenu.value || !viewport)
    return;

  const formatterPosition = window.innerHeight
      - viewport.offsetTop
      - viewport.height;

  if (formatterPosition < 1 && prevFormatterPosition < 1)
    return;

  prevFormatterPosition = formatterPosition;

  inlineMenu.value.style.setProperty('--btm', `${formatterPosition.toFixed(2)}px`);
}

onMounted(() => {
  window.visualViewport?.addEventListener('resize', handleKeyboardAppear);

  onBeforeUnmount(() => {
    window.visualViewport?.removeEventListener('resize', handleKeyboardAppear);
  });
});
</script>

<template>
  <Transition name="fade" appear>
    <div v-if="!isFallbackMode" ref="inlineMenu" class="inline-menu formatter">
      <slot />
    </div>
  </Transition>
</template>

<style lang="scss">
.inline-menu {
  --base-shadow-color: 0, 0, 0;

  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  bottom: var(--btm, 0px);
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

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
  }

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.25);

    backdrop-filter: blur(0.75rem);
  }

  &.fade-enter-active {
    transition-delay: 0.35s;
  }
}
</style>
