<template>
  <NavLink class="nav__link--title font-wide" to="/">
    <img
      src="/logo.webp"
      alt="purple keycap"
      class="nav__link__img nav__link__img--title"
      decoding="async"
      width="48"
      height="48"
      fetchpriority="low"
      loading="lazy"
    >

    Keycap
  </NavLink>
</template>

<style lang="scss">
.nav__link {
  &--title {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    font-size: min(1rem + 1vw, 1.75rem);
  }

  &__img {
    display: block;

    width: 1.5ch;
    height: auto;

    margin-bottom: 0;
    margin-right: 0.5rem;

    user-select: none;

    @media (prefers-reduced-motion: no-preference) {
      animation: press 10s 5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
    }
  }
}

@keyframes press {
  0% {
    transform: rotate(0);
  }

  2% {
    transform: translateY(0.5rem) scale(0.9);
  }

  3% {
    transform: translateY(0.5rem) scale(0.9);
  }

  4% {
    transform: rotate(0);
  }
}
</style>
