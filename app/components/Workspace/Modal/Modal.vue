<script setup lang="ts">
const props = defineProps<{
  onClose: () => void
}>();

const modal = useTemplateRef('modal');

useTinykeys({ Escape: props.onClose });
useFocusTrap(modal, { handleInitialFocusing: true });
</script>

<template>
  <div
    ref="modal"
    role="dialog"
    class="modal"
    aria-modal="true"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.modal {
  position: relative;

  padding:
    env(safe-area-inset-top)
    env(safe-area-inset-right)
    env(safe-area-inset-bottom)
    env(safe-area-inset-left);

  width: 90%;
  max-height: 90svh;

  border-radius: 0.5rem;
  border: 1px solid hsla(var(--text-color-hsl), 0.1);
  background-color: rgba(var(--surface-color-hsl), 0.98);
  box-shadow:
    inset -1px -1px 0.1rem rgba($color: #000000, $alpha: 0.025),
    1.3px 1.3px 5.3px rgba(0, 0, 0, 0.028),
    4.5px 4.5px 17.9px rgba(0, 0, 0, 0.042),
    20px 20px 80px rgba(0, 0, 0, 0.07);

  overflow-y: auto;

  @supports (backdrop-filter: blur(1px)) {
    backdrop-filter: blur(5px);
    background-color: hsla(var(--surface-color-hsl), 0.5);
  }

  @media (max-width: $breakpoint-tablet) {
    width: 100%;
    max-width: unset;

    height: 100%;
    max-height: unset;

    border: none;
    border-radius: 0;
  }
}
</style>
