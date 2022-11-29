<template>
  <ul class="skeleton">
    <li class="skeleton__item" />
    <li class="skeleton__item" />
    <li class="skeleton__item" />
    <li class="skeleton__item" />
    <li class="skeleton__item" />
  </ul>
</template>

<style lang="scss" scoped>
.skeleton {
  width: 100%;

  margin: 0;
  padding: 1rem 0.5rem;

  list-style-type: none;

  &__item {
    --normal-stripe-color: hsla(var(--text-color-hsl), 0.5);
    --light-stripe-color: hsla(var(--text-color-hsl), 0.75);
    --light-stripe-position: 50%;
    --light-stripe-padding: 4%;

    $numberOfItems: 5;

    height: 1rem;

    border-radius: 0.25rem;
    background-color: hsla(var(--text-color-hsl), 0.5);
    background-size: 50vw 100%;
    background-image: linear-gradient(
      to right,
      var(--normal-stripe-color) 0%,
      var(--normal-stripe-color) calc(var(--light-stripe-position) - var(--light-stripe-padding)),
      var(--light-stripe-color)  var(--light-stripe-position),
      var(--normal-stripe-color) calc(var(--light-stripe-position) + var(--light-stripe-padding)),
      var(--normal-stripe-color) 100%,
    );

    animation: background-wave 2s infinite linear;

    & + & {
      margin-top: 0.6rem;
    }

    @media screen and (max-width: 740px) {
      background-size: 100vw 100%;
    }

    @for $i from 1 to $numberOfItems + 1 {
      &:nth-of-type(#{$i}) {
        width: max(25%, #{random($limit: 90) + '%'});
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
