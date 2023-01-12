<script setup>
const numberOfParagraphs = 5;
</script>

<template>
  <div class="skeleton">
    <h2 class="skeleton__heading skeleton-loading-bg">
      &nbsp;
    </h2>

    <p v-for="n in numberOfParagraphs" :key="n" class="skeleton__text skeleton-loading-bg">
      &nbsp;
    </p>
  </div>
</template>

<style lang="scss">
.skeleton {
  padding: 10vh 1.5rem 25vh;

  &__heading,
  &__text {
    margin: 0;

    border-radius: 0.25rem;
  }

  &__heading {
    width: max(20%, #{random(90) + '%'});

    margin-bottom: 2rem;
  }

  &__text {
    $numberOfItems: 5;

    & + & {
      margin-top: 1rem;
    }

    @for $i from 1 to $numberOfItems + 1 {
      &:nth-of-type(#{$i}) {
        width: max(20%, #{random(100) + '%'});
      }
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    padding: 1rem 1rem 45vh;
  }
}
</style>
