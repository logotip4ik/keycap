<script setup lang="ts">
import type { SidebarState } from '~/components/Workspace/Sidebar/Sidebar.vue';

interface Props { state: SidebarState; onUpdateState: (newState: SidebarState) => any };
defineProps<Props>();

const user = useUser();
</script>

<template>
  <header class="toolbox__header">
    <!-- TODO: better accessibility -->
    <button
      class="toolbox__header__open-btn"
      :class="{ 'toolbox__header__open-btn--exposed': state === 'hidden' }"
      aria-controls="sidebar"
      :aria-pressed="state === 'pinned'"
      @click="onUpdateState(state === 'pinned' ? 'hidden' : 'pinned')"
      @mouseenter="state === 'hidden' && onUpdateState('visible')"
    >
      <LazyIconMenuRounded class="toolbox__header__open-btn__icon" />
    </button>

    <p class="toolbox__header__username font-wide">
      {{ user?.username }}
    </p>
  </header>
</template>

<style lang="scss">
.toolbox__header {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &__username {
    font-size: calc(1rem + 0.25vw);
    color: hsla(var(--text-color-hsl), 0.875);
    text-overflow: ellipsis;
    white-space: nowrap;

    margin: 0 0 0 var(--pd-x);
    padding: 0;

    overflow: hidden;
  }

  &__open-btn {
    --size: min(5vw, 2.5rem);

    flex-shrink: 0;

    width: var(--size);
    height: var(--size);

    appearance: none;
    border: none;
    border-radius: 0.25rem;
    outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);
    background-color: hsla(var(--surface-color-hsl), 0.95);

    cursor: pointer;
    transition: transform var(--sidebar-tr-duration) var(--ease);

    @supports (backdrop-filter: blur(1px)) {
      background-color: transparent;

      backdrop-filter: blur(12px);
    }

    @media (width <= $breakpoint-tablet) {
      --size: min(12.5vw, 3rem);
    }

    &:is(:hover, :focus-visible) {
      outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);

      &:focus-visible {
        background-color: hsla(var(--selection-bg-color-hsl), 0.25);
      }

      svg {
        color: hsla(var(--text-color-hsl), 0.65);

        transition-duration: .1s;
      }
    }

    &[aria-pressed="true"] {
      outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.75);
      box-shadow: 0 0 0.5rem 0 hsla(var(--selection-bg-color-hsl), 0.25);

      svg {
        color: hsla(var(--text-color-hsl), 0.8);

        transition-duration: .1s;
      }
    }

    &--exposed {
      transform: translate(calc(var(--dir) * var(--sidebar-width) + 1px), 1px) scale(calc(2 - var(--sidebar-hidden-scale)));
    }

    &__icon {
      color: hsla(var(--text-color-hsl), 0.5);

      width: 80%;
      height: auto;

      transition: color var(--sidebar-tr-duration) ease;
    }
  }
}
</style>
