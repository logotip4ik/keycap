<script setup lang="ts">
const props = defineProps<{
  type?: 'submit' | 'button' | 'reset'
  loading?: boolean
}>();

const delayedLoading = ref(props.loading);
const minChangeTime = 500;
let changeCallbackTimeout: ReturnType<typeof setTimeout> | undefined;
let lastChange = Date.now();

watch(() => props.loading, (loading) => {
  const lastChangeDiff = Date.now() - lastChange;
  if (!loading && lastChangeDiff < minChangeTime) {
    changeCallbackTimeout = setTimeout(() => {
      delayedLoading.value = props.loading;
      lastChange = Date.now();
    }, minChangeTime - lastChangeDiff);
  }
  else {
    lastChange = Date.now();
    delayedLoading.value = loading;
    clearTimeout(changeCallbackTimeout);
    changeCallbackTimeout = undefined;
  }
});
</script>

<template>
  <button
    class="form__button"
    :type="type"
    :class="{ 'form__button--loading': delayedLoading }"
    :disabled="loading"
    :aria-busy="loading"
  >
    <slot />
  </button>
</template>

<style lang="scss">
.form__button {
  position: relative;
  z-index: 1;

  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--surface-color);

  width: 90%;
  max-width: 330px;

  padding: 1rem 2rem;

  border: none;
  border-radius: 0.5rem;
  outline: 1px solid transparent;
  outline-offset: -1px;
  background-color: var(--text-color);
  box-shadow: 0 0 1rem hsla(var(--text-color-hsl), 0.125);

  cursor: pointer;
  transition: outline .3s, outline-offset .3s, transform 0.15s;

  &:is(:hover, :focus-visible) {
    outline-style: solid;
    outline-color: var(--text-color);
    outline-offset: 0.25rem;

    transition: outline-color 0.1s, outline-offset 0s, transform 0.15s;
  }

  &:active {
    transform: scale(0.98);
  }

  &::after,
  &::before {
    content: '';

    position: absolute;

    opacity: 0;
    transition: opacity .2s;
    pointer-events: none;
  }

  &::after {
    inset: 0;
    z-index: 1;

    border-radius: inherit;
    background-color: hsla(var(--text-color-hsl), 0.95);

    @supports (backdrop-filter: blur(1px)) {
      backdrop-filter: blur(2px);
      background-color: hsla(var(--text-color-hsl), 0.5);
    }
  }

  &::before {
    --size: 1.5rem;

    top: calc(50% - var(--size) / 2);
    left: calc(50% - var(--size) / 2);
    z-index: 2;

    width: var(--size);
    height: var(--size);

    border-radius: 50%;
    border: 2px solid transparent;
    border-left-color: var(--surface-color);

    pointer-events: none;
    animation: spin 1s infinite linear;
  }

  &--loading {
    &::after,
    &::before {
      opacity: 1;
    }
  }

  & + & {
    margin-top: 1rem;
  }
}
</style>
