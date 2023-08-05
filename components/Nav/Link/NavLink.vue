<template>
  <NuxtLink class="nav__link">
    <slot />
  </NuxtLink>
</template>

<style lang="scss">
.nav__link {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  font-size: max(1vw, 1.175rem);
  font-weight: 500;
  text-decoration: none;
  color: var(--text-color);

  margin: 0;
  padding: 1rem 0;

  transition: color .3s, filter .3s;

  &__img {
    display: block;

    width: 2rem;
    height: auto;

    margin-right: 0.5rem;
    margin-bottom: 0.125rem;
  }

  @media (hover: hover) {
    color: hsla(var(--text-color-hsl), 0.8);

    &:is(:focus-visible, :hover) {
      transition-duration: .1s;

      color: hsla(var(--text-color-hsl), 1);
      filter: drop-shadow(0px 0px 0.5rem hsla(var(--text-color-hsl), 0.15));
    }
  }
}
</style>
