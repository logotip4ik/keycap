<template>
  <div v-once class="contents__skeleton">
    <div v-for="i in 3" :key="i" class="contents__skeleton__item skeleton-bg" />
  </div>
</template>

<style lang="scss">
.contents__skeleton {
  &__item {
    width: 100%;
    height: 2rem;

    border-radius: 0.225rem;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }

    &:nth-child(2) {
      opacity: 0.5;
    }
    &:nth-child(3) {
      opacity: 0.25;
    }
  }
}
</style>
