<script setup lang="ts">
defineProps<{
  name: IconName
  title?: string
}>();

const titleId = useId();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    fill="currentColor"
    :aria-labelledby="title ? titleId : undefined"
    aria-hidden="true"
    role="img"
    width="1em"
    height="1em"
    class="icon"
  >
    <title v-if="title" :id="titleId">{{ title }}</title>
    <use :href="`/svg/${name}.svg#fragment`" />
  </svg>
</template>

<style>
.icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
