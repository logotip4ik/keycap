<script setup lang="ts">
defineProps<{
  id: string
  name: string
  value: string | boolean
}>();
</script>

<template>
  <FormLabel :target="id" class="sr-only">
    Server related content
  </FormLabel>
  <input
    :id="id"
    :name="name"
    type="hidden"
    :value="value"
  >
</template>
