<template>
  <div v-once class="skeleton contents__skeleton">
    <div v-for="i in 3" :key="i" class="contents__skeleton__item skeleton-bg" />
  </div>
</template>

<style lang="scss">
@use 'sass:math';

.contents__skeleton {
  &__item {
    height: 1.75rem;

    margin-top: 0.75rem;
    border-radius: 0.225rem;

    @for $i from 1 to 4 {
      &:nth-child(#{$i}) {
        opacity: #{math.div(1, $i)};
        width: #{25 + random($limit: 25) + "%"}
      }
    }
  }
}
</style>
