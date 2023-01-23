<script setup lang="ts">
import type { ToastInstance } from '~/composables/toasts';

interface Props { toast: ToastInstance; animationDuration: number }
const props = defineProps<Props>();

let timeout: NodeJS.Timeout;

onMounted(() => {
  const totalTime = props.animationDuration + props.toast.duration;
  // TODO: add animation duration to total show duration of notification item
  timeout = setTimeout(() => props.toast.delete(), totalTime);
});

onBeforeUnmount(() => clearTimeout(timeout));
</script>

<template>
  <output :ref="toast.el" class="notification" role="status" aria-live="polite">
    <Icon v-if="toast.type === 'info'" name="ic:outline-info" class="notification__icon" aria-hidden="true" data-icon />
    <span v-else-if="toast.type === 'loading'" class="notification__icon notification__icon--spinner" aria-hidden="true" data-icon />

    <p class="notification__text">{{ toast.message }}</p>
  </output>
</template>

<style lang="scss">
.notification {
  --icon-size: 1.4rem;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  font: inherit;
  font-size: 1.05rem;
  color: var(--surface-color);

  max-width: 33ch;

  padding: 0.6rem 1rem;

  border-radius: 0.25rem;
  border: 1px solid hsla(var(--text-color-hsl), 1.0);
  background-color: hsla(var(--text-color-hsl), 0.9);

  box-shadow:
      0px 0px 5.3px -10px rgba(0, 0, 0, 0.028),
      0px 0px 17.9px -10px rgba(0, 0, 0, 0.042),
      0px 0px 80px -10px rgba(0, 0, 0, 0.07);

  @supports (backdrop-filter: blur(1px)) {
    color: var(--text-color);

    background-color: hsla(var(--text-color-hsl), 0.05);
    border: 1px solid hsla(var(--text-color-hsl), 0.125);
    backdrop-filter: blur(6px);
  }

  @media screen and (max-width: $breakpoint-tablet) {
    max-width: 28ch;
  }

  &__text {
    margin: 0;
    padding-top: 0.1rem;
  }

  &__icon,
  &__spinner {
    width: var(--icon-size);
    height: var(--icon-size);

    opacity: 0.65;

    margin-right: 0.6rem;

    &--spinner {
      width: calc(var(--icon-size) / 1.1);
      height: calc(var(--icon-size) / 1.1);

      border-radius: 50%;
      border: 2px solid transparent;
      border-left-color: var(--text-color);

      animation: spin 1s infinite linear;
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
