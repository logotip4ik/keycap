<template>
  <div class="skeleton">
    <h3 class="skeleton__heading skeleton-loading-bg" />

    <div class="skeleton__row">
      <p class="skeleton__row__text skeleton-loading-bg" />
      <p class="skeleton__row__date skeleton-loading-bg" />
    </div>
    <div class="skeleton__row">
      <p class="skeleton__row__text skeleton-loading-bg" />
      <p class="skeleton__row__date skeleton-loading-bg" />
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:math";

.skeleton__row {
  $numberOfItems: 2;

  display: flex;
  justify-content: space-between;
  align-items: center;

  & + & {
    margin-top: 0.75rem;
  }

  &__text,
  &__date {
    height: 1.5rem;

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
