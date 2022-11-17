<script setup lang="ts">
const user = useUser();

const headingText = computed(() => {
  if (!user.value) return '';

  return `${user.value.username}'s workspace`;
});
</script>

<template>
  <nav class="nav">
    <p class="nav__heading">
      {{ headingText }}
    </p>
  </nav>
</template>

<style lang="scss">
.nav {
  display: flex;
  justify-content: flex-between;
  align-items: center;

  width: 100%;

  padding: 0.5rem 1.5rem;

  &__heading {
    font-size: 1.1rem;
  }
}
</style>
