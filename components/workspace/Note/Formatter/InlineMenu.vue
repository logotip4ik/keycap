<script setup lang="ts">
import parseDuration from 'parse-duration';

import type { Editor } from '@tiptap/core';

interface Props { editor: Editor }
defineProps<Props>();

const isFallbackMode = useFallbackMode();
const INITIAL_DELAY_TO_APPEAR = parseDuration('0.35s');

const shouldShow = ref(false);
const inlineMenu = ref<HTMLElement | null>(null);

function isOverflown({ clientWidth, scrollWidth }: HTMLElement) {
  const diff = scrollWidth - clientWidth;

  return diff > 2;
}

async function addScrollIfNeeded() {
  if (inlineMenu.value && isOverflown(inlineMenu.value as HTMLElement))
    inlineMenu.value.classList.add('overflown');
}

onMounted(() => {
  setTimeout(() => {
    shouldShow.value = true;
  }, INITIAL_DELAY_TO_APPEAR);
});
</script>

<template>
  <Transition name="fade" @enter="addScrollIfNeeded">
    <div v-if="shouldShow && !isFallbackMode" ref="inlineMenu" class="inline-menu formatter">
      <slot />
    </div>
  </Transition>
</template>

<style lang="scss">
.inline-menu {
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;

  padding: 0.325rem 1.125rem;

  width: 100%;

  border-top: 1px solid hsla(var(--text-color-hsl), 0.25);
  background-color: hsla(var(--surface-color-hsl), 0.95);
  box-shadow: 0 0 1rem hsla(var(--text-color-hsl), 0.125);

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.65);

    backdrop-filter: blur(0.4rem);
  }

  &.overflown {
    justify-content: flex-start;

    overflow: auto;
    scroll-snap-type: x proximity;
    scroll-padding-inline: 1.125rem;

    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
