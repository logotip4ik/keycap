<script setup lang="ts">
interface Props {
  id: string
  name: string
  type: 'checkbox' | 'text'
  value: string | boolean
}

defineProps<Props>();
</script>

<template>
  <input
    :id="id"
    :name="name"
    :type="type"
    :value="type === 'text' ? value : undefined"
    :checked="type === 'checkbox' ? Boolean(value) : undefined"
    class="form__input form__input--hidden"
  >
</template>

<style lang="scss">
.form__input {
  &--hidden {
    display: none;
  }
}
</style>
