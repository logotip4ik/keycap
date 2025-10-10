<script setup lang="ts">
const props = defineProps<{
  toast: ToastInstance
  animationDuration: number
}>();

interface Timer {
  id?: number
  start?: number
  seenFor: number
  pause: () => void
  resume: () => void
}

function makeTimer(cb: () => void, delay: number, ...args: Array<any>): Timer {
  return {
    seenFor: 0,
    pause() {
      if (!this.start) {
        return;
      }

      clearTimeout(this.id);

      this.seenFor += Date.now() - this.start;
      this.id = undefined;
      this.start = undefined;
    },

    resume() {
      if (this.id) {
        return;
      }

      const timeout = delay - this.seenFor;
      this.id = setTimeout(cb, timeout, ...args);
      this.start = Date.now();
    },
  };
}

let timer: Timer | undefined;
let pointerIsInsideToast = false;

function handlePointerEvent(type: 'leave' | 'enter') {
  if (type === 'enter') {
    pointerIsInsideToast = true;
    timer?.pause();
  }
  else {
    pointerIsInsideToast = false;

    // user focused button inside toast with button
    if (!props.toast.el.value.contains(document.activeElement)) {
      timer?.resume();
    }
  }
}

function handleKeyboardEvent(type: 'leave' | 'enter') {
  if (pointerIsInsideToast) {
    return;
  }

  if (type === 'enter') {
    timer?.pause();
  }
  else {
    timer?.resume();
  }
}

onMounted(() => {
  if (props.toast.duration >= Number.POSITIVE_INFINITY) {
    return;
  }

  const totalTime = props.animationDuration + props.toast.duration;
  timer = makeTimer(() => props.toast.remove(), totalTime);
  timer.resume();
});

onBeforeUnmount(() => {
  timer?.pause();
});
</script>

<template>
  <output
    :ref="toast.el"
    class="toast"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    @pointerenter="handlePointerEvent('enter')"
    @pointerleave="handlePointerEvent('leave')"
  >
    <Icon v-if="toast.type === 'info'" name="info-outline" class="toast__icon" aria-hidden="true" />
    <span v-else-if="toast.type === 'loading'" class="toast__icon toast__icon--spinner" aria-hidden="true" />

    <p class="toast__text">{{ toast.message }}</p>

    <button
      v-for="(button, i) in toast.buttons"
      :key="`${i}-${button.text}`"
      class="toast__button"
      tabindex="1"
      @click="button.onClick(toast)"
      @focus="handleKeyboardEvent('enter')"
      @blur="handleKeyboardEvent('leave')"
    >
      {{ button.text }}
    </button>
  </output>
</template>

<style lang="scss">
.toast {
  --base-color-saturation: 0;
  --base-shadow-color: 0, 0, 0;

  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: flex-start;
  align-items: flex-start;

  font: inherit;
  font-size: 1.125rem;
  color: var(--surface-color);

  min-width: 225px;

  padding: 0.85rem 1rem;

  border-radius: 0.25rem;
  border: 1px solid hsla(var(--text-color-hsl), 1.0);
  background-color: hsla(var(--text-color-hsl), 0.9);
  pointer-events: all;

  box-shadow:
    2px 1.7px 5.3px rgba(var(--base-shadow-color), 0.02),
    6.7px 5.6px 17.9px rgba(var(--base-shadow-color), 0.03),
    30px 25px 80px rgba(var(--base-shadow-color), 0.05)
  ;

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
    --base-color-saturation: 0.1;
  }

  @supports (backdrop-filter: blur(1px)) {
    color: var(--text-color);

    background-color: transparent;
    background-image: linear-gradient(
      to bottom,
      hsla(var(--selection-bg-color-hsl), calc(var(--base-color-saturation) + 0.075)),
      hsla(var(--selection-bg-color-hsl), calc(var(--base-color-saturation) + 0.175)),
    );
    border: 1px solid hsla(var(--selection-bg-color-hsl), 0.5);
    backdrop-filter: blur(12px) brightness(110%) saturate(120%);
  }

  &__text {
    margin: 0;
    padding-top: 0.1rem;

    max-width: 33ch;
  }

  &__icon {
    --icon-size: 1.4rem;

    width: var(--icon-size);
    height: var(--icon-size);

    opacity: 0.65;

    margin-top: 0.25rem;
    margin-right: 0.66rem;

    &--spinner {
      position: relative;

      &::after {
        content: '';

        position: absolute;
        inset: 0.15rem;

        border-radius: 50%;
        border: 2px solid transparent;
        border-left-color: currentColor;
        border-right-color: currentColor;

        animation: spin 1s infinite linear;
      }
    }
  }

  &__button {
    grid-column: 1 / 3;

    position: relative;
    z-index: 1;

    font: inherit;
    font-size: 1.075rem;
    color: hsla(var(--text-color-hsl), 0.85);

    width: 100%;

    padding: 0.5rem 1rem;
    margin-top: 0.85rem;

    appearance: none;
    border-radius: 0.2rem;
    background-color: transparent;
    border: 1px solid hsla(var(--text-color-hsl), 0.25);

    cursor: pointer;

    transition: color .3s;

    & + & {
      margin-top: 0.6rem;
    }

    &::before {
      content: "";

      position: absolute;
      inset: 0;
      z-index: -1;

      opacity: 0.25;
      border-radius: inherit;
      background-image: linear-gradient(
        to bottom,
        hsla(var(--text-color-hsl), 0.0),
        hsla(var(--text-color-hsl), 0.1)
      );

      transition: opacity 0.3s;
    }

    &:is(:hover, :focus-visible) {
      transition-duration: 0.1s;

      color: hsla(var(--text-color-hsl), 1);

      &::before {
        transition-duration: 0.1s;

        opacity: 1;
      }
    }

    @media (max-width: $breakpoint-tablet) {
      padding-block: 0.65rem;
    }
  }
}
</style>
