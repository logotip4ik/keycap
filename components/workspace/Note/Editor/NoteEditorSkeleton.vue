<template>
  <div class="skeleton">
    <p class="skeleton__heading skeleton-bg" />

    <p class="skeleton__text skeleton-bg" />
    <p class="skeleton__text skeleton-bg" />
    <p class="skeleton__text skeleton-bg" />
    <p class="skeleton__text skeleton-bg" />
  </div>
</template>

<style lang="scss">
@use "sass:math";

.skeleton {
  padding: 10vh 1.5rem 25vh;

  &__heading,
  &__text {
    margin: 0;

    border-radius: 0.15rem;
  }

  &__heading {
    width: (random(54) + 24)+#{'%'};
    height: 2rem;

    margin-bottom: 2rem;
  }

  &__text {
    $numberOfItems: 4;

    height: 1.25rem;

    & + & {
      margin-top: 1rem;
    }

    // Skip first element
    @for $i from 2 to $numberOfItems + 2 {
      &:nth-of-type(#{$i}) {
        width: (random(54) + 24)+#{'%'};

        opacity: math.div(1, $i);
      }
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    padding: 1rem 1rem 45vh;
  }
}
</style>
