<script setup lang="ts">
defineProps<{ appear?: boolean }>();
</script>

<template>
  <Transition name="fade" :appear>
    <slot />
  </Transition>
</template>

<style lang="scss">
.fade-enter-active {
  transition: opacity 0.3s * 2 ease;

  &.fast-fade {
    transition-duration: 0.3s;
  }

  &.skeleton {
    transition-delay: 0.5s;
  }
}

.fade-leave-active {
  display: none !important;
  transition-duration: 0s;
}

.fade-enter-from {
  opacity: 0;
}
</style>
