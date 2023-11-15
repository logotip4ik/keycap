<script setup lang="ts">
interface Props {
  action: string
  method?: 'GET' | 'POST'
}

defineProps<Props>();
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
