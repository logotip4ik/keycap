<script setup lang="ts">
const props = defineProps<{
  injectionKey: InjectionKey<{ state: Ref<SidebarState> }>
}>();

const { state } = inject(props.injectionKey)!;
</script>

<template>
  <button
    data-open-button
    class="sidebar__open-button"
    :class="{ 'sidebar__open-button--exposed': state === 'hidden' }"
    :aria-pressed="state === 'pinned'"
    @click="state = unpinSidebar(state)"
    @mouseenter="state === 'hidden' && (state = 'visible')"
  >
    <slot />
  </button>
</template>

<style lang="scss">
.sidebar__open-button {
  --size: min(5vw, 2.75rem);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: var(--size);
  height: var(--size);

  appearance: none;
  border: none;
  border-radius: 0.25rem;
  outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);
  background-color: hsla(var(--surface-color-hsl), 0.95);

  cursor: pointer;
  transition: transform var(--sidebar-tr-duration) var(--sidebar-tr-ease);

  &[aria-pressed="true"] {
    outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.75);
    box-shadow: 0 0 0.5rem 0 hsla(var(--selection-bg-color-hsl), 0.25);

    svg {
      color: hsla(var(--text-color-hsl), 0.8);

      transition-duration: .1s;
    }
  }

  &--exposed {
    transform:
      translate3d(
        calc(var(--dir) * var(--sidebar-width) + var(--dir) * 1px),
        1px,
        0
      )
      scale3d(
        calc(2 - var(--sidebar-hidden-scale)),
        calc(2 - var(--sidebar-hidden-scale)),
        1
      )
    ;
  }

  svg {
    color: hsla(var(--text-color-hsl), 0.5);

    width: 62.5%;
    height: auto;

    transition: color var(--sidebar-tr-duration) ease;
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

  @supports (backdrop-filter: blur(1px)) {
    background-color: transparent;

    backdrop-filter: blur(12px);
  }

  @media (width <= $breakpoint-tablet) {
    --size: min(12.5vw, 3rem);
  }
}
</style>
