<script setup lang="ts">
defineProps<{
  target: string
}>();
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
