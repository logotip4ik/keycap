<script setup lang="ts">
defineProps<{ top?: string }>();
</script>

<template>
  <slot class="_blob" :style="{ '--t': top }" />
</template>
