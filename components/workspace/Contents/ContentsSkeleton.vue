<template>
  <div class="skeleton">
    <p class="skeleton__item skeleton-loading-bg" />
    <p class="skeleton__item skeleton-loading-bg" />
    <p class="skeleton__item skeleton-loading-bg" />
    <p class="skeleton__item skeleton-loading-bg" />
    <p class="skeleton__item skeleton-loading-bg" />
    <p class="skeleton__item skeleton-loading-bg" />
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";

.skeleton {
  width: 100%;

  margin: 0;
  padding: 0.5rem 0.5rem;

  &__item {
    $numberOfItems: 6;

    height: 1.75rem;

    margin: 0;

    border-radius: 0.15rem;

    & + & {
      margin-top: 0.75rem;
    }

    @for $i from 1 to $numberOfItems + 1 {
      &:nth-of-type(#{$i}) {
        width: (random(74) + 24)+#{'%'};

        opacity: math.div(1, $i);
      }
    }
  }
}
</style>
