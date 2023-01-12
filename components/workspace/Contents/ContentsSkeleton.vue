<template>
  <ul class="skeleton">
    <li class="skeleton__item skeleton-loading-bg" />
    <li class="skeleton__item skeleton-loading-bg" />
    <li class="skeleton__item skeleton-loading-bg" />
    <li class="skeleton__item skeleton-loading-bg" />
    <li class="skeleton__item skeleton-loading-bg" />
  </ul>
</template>

<style lang="scss" scoped>
.skeleton {
  width: 100%;

  margin: 0;
  padding: 1rem 0.5rem;

  list-style-type: none;

  &__item {
    $numberOfItems: 5;

    height: 1rem;

    border-radius: 0.25rem;

    &+& {
      margin-top: 0.6rem;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      background-size: 100vw 100%;
    }

    @for $i from 1 to $numberOfItems + 1 {
      &:nth-of-type(#{$i}) {
        width: max(25%, #{random($limit: 100) + '%'});
      }
    }
  }
}
</style>
