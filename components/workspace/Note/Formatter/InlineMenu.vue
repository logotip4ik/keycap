<script setup lang="ts">
import type { Editor } from '@tiptap/core';

interface Props { editor: Editor }
defineProps<Props>();

const isFallbackMode = useFallbackMode();
</script>

<template>
  <Transition name="fade" appear>
    <div v-if="!isFallbackMode" class="inline-menu formatter">
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

  padding: 0.325rem;

  width: 100%;

  border-top: 1px solid hsla(var(--text-color-hsl), 0.25);
  background-color: hsla(var(--surface-color-hsl), 0.95);
  box-shadow: 0 0 1rem hsla(var(--text-color-hsl), 0.125);

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.25);

    backdrop-filter: blur(0.75rem);
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

  &.fade-enter-active {
    transition-delay: 0.35s;
  }
}
</style>
