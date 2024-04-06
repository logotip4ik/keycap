<template>
  <div class="skeleton">
    <h3 class="skeleton__heading skeleton-bg" />

    <div class="skeleton__row">
      <p class="skeleton__row__text skeleton-bg" />
      <p class="skeleton__row__date skeleton-bg" />
    </div>
    <div class="skeleton__row">
      <p class="skeleton__row__text skeleton-bg" />
      <p class="skeleton__row__date skeleton-bg" />
    </div>
    <div class="skeleton__row">
      <p class="skeleton__row__text skeleton-bg" />
      <p class="skeleton__row__date skeleton-bg" />
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:math";

.skeleton__heading {
  width: (random(54) + 24)+#{'%'};
  height: 2rem;

  margin: 0;
  margin-block: 0.75rem 2.625rem;

  border-radius: 0.15rem;
}

.skeleton__row {
  $numberOfItems: 3;

  display: flex;
  justify-content: space-between;
  align-items: center;

  & + & {
    margin-top: 1.125rem;
  }

  &__text,
  &__date {
    height: 1.65rem;

    margin: 0;

    border-radius: 0.15rem;
  }

  @for $i from 1 to $numberOfItems + 1 {
    &:nth-of-type(#{$i}) {
      .skeleton__row__text,
      .skeleton__row__date {
        width: (random(15) + 17)+#{'%'};

        opacity: math.div(1, $i + 1);
      }

      .skeleton__row__text {
        width: (random(15) + 17)+#{'%'};
      }
    }
  }
}
</style>
