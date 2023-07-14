<script setup lang="ts">
interface Props {
  type?: 'submit' | 'button' | 'reset'
  loading?: boolean
}

withDefaults(defineProps<Props>(), { loading: false });
</script>

<template>
  <button
    class="form__button"
    :type="type"
    :class="{ 'form__button--loading': loading }"
    :disabled="loading"
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
  transition: outline .3s, outline-offset .3s;

  &:is(:hover, :focus-visible) {
    outline-style: solid;
    outline-color: var(--text-color);
    outline-offset: 0.25rem;

    transition: outline-color 0.1s, outline-offset 0s;
  }

  &::after,
  &::before {
    content: '';

    position: absolute;

    opacity: 0;
    transition: opacity .2s;
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

    animation: spin 1s infinite linear;
  }

  &--loading {
    &::after,
    &::before {
      opacity: 1;
    }

    outline-offset: -1px !important;
    pointer-events: none;
  }

  & + & {
    margin-top: 1rem;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
