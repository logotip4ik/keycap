<template>
  <div class="skeleton">
    <h2 class="skeleton__heading skeleton-loading-bg" />

    <p class="skeleton__text skeleton-loading-bg" />
    <p class="skeleton__text skeleton-loading-bg" />
    <p class="skeleton__text skeleton-loading-bg" />
    <p class="skeleton__text skeleton-loading-bg" />
    <p class="skeleton__text skeleton-loading-bg" />
  </div>
</template>

<style lang="scss">
@use "sass:math";

.skeleton {
  padding: 10vh 1.5rem 25vh;

  &__heading,
  &__text {
    margin: 0;

    border-radius: 0.25rem;
  }

  &__heading {
    width: (random(74) + 24)+#{'%'};
    height: 2rem;

    margin-bottom: 2rem;
  }

  &__text {
    $numberOfItems: 5;

    height: 1.25rem;

    & + & {
      margin-top: 1rem;
    }

    @for $i from 1 to $numberOfItems + 1 {
      &:nth-of-type(#{$i}) {
        width: (random(74) + 24)+#{'%'};

        opacity: math.div(1, $i);
      }
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    padding: 1rem 1rem 45vh;
  }
}
</style>
