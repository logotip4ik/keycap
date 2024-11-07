<script setup lang="ts">
defineProps<{
  action: string
  method?: 'GET' | 'POST'
}>();
</script>

<template>
  <form class="form" :action="action" :method="method">
    <slot />
  </form>
</template>

<style lang="scss">
.form {
  width: 95%;
  max-width: 450px;

  margin: 0 auto;
  padding: clamp(1rem, 2vw, 2rem);
}
</style>
