<template>
  <div v-once class="recent-skeleton">
    <div v-for="i in 4" :key="i" class="recent-skeleton__item skeleton-bg" />
  </div>
</template>

<style lang="scss">
@use "sass:math";

.recent-skeleton {
  &__item {
    width: 100%;
    height: 1.35rem;

    border-radius: 0.225rem;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }

    @for $i from 1 to 5 {
      &:nth-child(#{$i}) {
        opacity: #{math.div(1, $i)};
        width: #{25 + random($limit: 25) + "%"}
      }
    }
  }
}
</style>
