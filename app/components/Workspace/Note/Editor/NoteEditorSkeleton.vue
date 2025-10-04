<template>
  <div class="skeleton editor-skeleton">
    <p class="editor-skeleton__heading skeleton-bg" />

    <p v-for="i in 4" :key="i" class="editor-skeleton__text skeleton-bg" />
  </div>
</template>

<style lang="scss">
.editor-skeleton {
  padding: 20vh 1.5rem 25vh;

  &__heading,
  &__text {
    margin: 0;

    border-radius: 0.15rem;
  }

  &__heading {
    width: (math.random(54) + 24)+#{'%'};
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
        width: (math.random(54) + 24)+#{'%'};

        opacity: math.div(1, $i);
      }
    }
  }

  @media (max-width: $breakpoint-tablet) {
    padding: 19vh 1rem 1rem;
  }
}
</style>
