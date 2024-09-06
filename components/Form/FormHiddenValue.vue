<script setup lang="ts">
defineProps<{
  name: string
  value: string | boolean
}>();
</script>

<template>
  <input
    :name="name"
    type="hidden"
    :value="value"
  >
</template>
