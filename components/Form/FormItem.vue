<script setup lang="ts">
defineProps<{
  actions?: boolean
}>();
</script>

<template>
  <div class="form__item" :class="{ 'form__item--actions': actions }">
    <slot />
  </div>
</template>

<style lang="scss">
.form__item {
  position: relative;
  z-index: 1;

  width: 100%;

  & + & {
    margin-top: 1.25rem;
  }

  &--actions {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;

    text-align: center;

    margin-top: 2.5rem !important;
  }

  &:focus-within {
    label {
      opacity: 1;

      transition: opacity .1s;
    }
  }
}
</style>
