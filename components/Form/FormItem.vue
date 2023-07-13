<script setup lang="ts">
interface Props {
  actions?: boolean
}

withDefaults(defineProps<Props>(), { actions: false });
</script>

<template>
  <div v-bind="$attrs" class="form__item" :class="{ 'form__item--actions': actions }">
    <slot />
  </div>
</template>

<style lang="scss">
.form__item {
  position: relative;
  z-index: 1;

  width: 100%;

  &--actions {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;

    text-align: center;

    margin-top: 2.5rem;
  }

  & + & {
    margin-top: 1.25rem;
  }

  &:focus-within {
    label {
      opacity: 1;

      transition: opacity .1s;
    }
  }
}
</style>
