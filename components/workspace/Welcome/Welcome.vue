<script setup lang="ts">
const isSmallScreen = inject(IsSmallScreenKey);
</script>

<template>
  <div v-once class="welcome">
    <p class="welcome__title font-wide">
      Welcome back
    </p>

    <WorkspaceWelcomeShortcuts
      v-if="!isSmallScreen"
    />
  </div>
</template>

<style lang="scss">
.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  width: 100%;
  height: 100%;

  padding: 1.75rem;

  &__title {
    font-size: min(5.75vw, 2.75rem);
    max-width: 33ch;
  }
}
</style>
