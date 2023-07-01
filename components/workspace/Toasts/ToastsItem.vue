<script setup lang="ts">
import type { ToastInstance } from '~/composables/toasts';

interface Props { toast: ToastInstance; animationDuration: number }
const props = defineProps<Props>();

let timeout: NodeJS.Timeout;

onMounted(() => {
  const totalTime = props.animationDuration + props.toast.duration;

  if (props.toast.duration < Number.POSITIVE_INFINITY)
    timeout = setTimeout(() => props.toast.remove(), totalTime);
});

onBeforeUnmount(() => clearTimeout(timeout));
</script>

<template>
  <output
    :ref="toast.el"
    class="toast"
    role="status"
    aria-live="polite"
  >
    <Icon v-if="toast.type === 'info'" name="ic:outline-info" class="toast__icon" aria-hidden="true" data-icon />
    <span v-else-if="toast.type === 'loading'" class="toast__icon toast__icon--spinner" aria-hidden="true" data-icon />

    <p class="toast__text">{{ toast.message }}</p>

    <button
      v-for="(button, i) in props.toast.buttons"
      :key="`${i}-${button.text}`"
      class="toast__button"
      @click="button.onClick(props.toast)"
    >
      {{ button.text }}
    </button>
  </output>
</template>

<style lang="scss">
.toast {
  --icon-size: 1.4rem;
  --base-shadow-color: 0, 0, 0;

  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: flex-start;
  align-items: flex-start;

  font: inherit;
  font-size: 1.125rem;
  color: var(--surface-color);

  max-width: 33ch;

  padding: 0.85rem 1.5rem;

  border-radius: 0.25rem;
  border: 1px solid hsla(var(--text-color-hsl), 1.0);
  background-color: hsla(var(--text-color-hsl), 0.9);

  box-shadow:
    2px 1.7px 5.3px rgba(var(--base-shadow-color), 0.02),
    6.7px 5.6px 17.9px rgba(var(--base-shadow-color), 0.03),
    30px 25px 80px rgba(var(--base-shadow-color), 0.05)
  ;

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
  }

  @supports (backdrop-filter: blur(1px)) {
    color: var(--text-color);

    background-color: hsla(var(--selection-bg-color-hsl), 0.1);
    border: 1px solid hsla(var(--selection-bg-color-hsl), 0.5);
    backdrop-filter: blur(9px);
  }

  &__text {
    margin: 0;
    padding-top: 0.1rem;
  }

  &__icon,
  &__spinner {
    flex-shrink: 0;

    width: var(--icon-size);
    height: var(--icon-size);

    opacity: 0.65;

    margin-right: 0.6rem;

    &--spinner {
      width: calc(var(--icon-size) / 1.1);
      height: calc(var(--icon-size) / 1.1);

      border-radius: 50%;
      border: 2px solid transparent;
      border-left-color: currentColor;

      animation: spin 1s infinite linear;
    }
  }

  &__button {
    grid-column: 1 / 3;

    font: inherit;
    font-size: 1.075rem;
    color: hsla(var(--text-color-hsl), 0.85);

    width: 100%;

    padding: 0.5rem 1rem;
    margin-top: 1.25rem;

    appearance: none;
    border-radius: 0.2rem;
    background-color: transparent;
    border: 1px solid hsla(var(--text-color-hsl), 0.25);

    cursor: pointer;
    pointer-events: all;

    transition: color .3s, background-color .3s;

    & + & {
      margin-top: 0.6rem;
    }

    &:is(:hover, :focus-visible) {
      transition-duration: 0.1s;

      color: hsla(var(--text-color-hsl), 1);
      background-color: hsla(var(--text-color-hsl), 0.075);
    }

    @media screen and (max-width: $breakpoint-tablet) {
      padding-block: 0.65rem;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0)
  }

  to {
    transform: rotate(1turn)
  }
}
</style>
