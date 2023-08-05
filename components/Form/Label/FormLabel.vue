<script setup lang="ts">
interface Props {
  target: string
}

defineProps<Props>();
</script>

<template>
  <label :for="target" class="form__label">
    <slot />
  </label>
</template>

<style lang="scss">
.form__label {
  display: block;

  color: transparent;

  width: 0;
  height: 0;

  overflow: hidden;
}
</style>
