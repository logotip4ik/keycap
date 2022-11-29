<script setup>
const numberOfParagraphs = 5;
</script>

<template>
  <div class="skeleton">
    <h2 class="skeleton__heading">
      &nbsp;
    </h2>

    <p v-for="n in numberOfParagraphs" :key="n" class="skeleton__text">
      &nbsp;
    </p>
  </div>
</template>

<style lang="scss">
.skeleton {
  padding: 0.75rem .75rem 0;

  &__heading,
  &__text {
    --normal-stripe-color: hsla(var(--text-color-hsl), 0.25);
    --light-stripe-color: hsla(var(--text-color-hsl), 0.5);
    --light-stripe-position: 50%;
    --light-stripe-padding: 4%;

    margin: 0;

    border-radius: 0.25rem;
    background-color: hsla(var(--text-color-hsl), 0.5);
    background-size: 150vw 100%;
    background-image: linear-gradient(
      to right,
      var(--normal-stripe-color) 0%,
      var(--normal-stripe-color) calc(var(--light-stripe-position) - var(--light-stripe-padding)),
      var(--light-stripe-color)  var(--light-stripe-position),
      var(--normal-stripe-color) calc(var(--light-stripe-position) + var(--light-stripe-padding)),
      var(--normal-stripe-color) 100%,
    );

    animation: background-wave 2s infinite linear;
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
        width: max(20%, #{random(90) + '%'});
      }
    }
  }
}

@keyframes background-wave {
  from {
    background-position: 100%;
  }

  to {
    background-position: 0%;
  }
}
</style>
