<template>
  <div v-once class="contents__skeleton">
    <div v-for="i in 3" :key="i" class="contents__skeleton__item skeleton-bg" />
  </div>
</template>

<style lang="scss">
@use 'sass:math';

.contents__skeleton {
  &__item {
    width: 100%;
    height: 2rem;

    border-radius: 0.225rem;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }

    @for $i from 1 to 4 {
      &:nth-child(#{$i}) {
        opacity: #{math.div(1, $i)};
        width: #{25 + random($limit: 25) + "%"}
      }
    }
  }
}
</style>
