<template>
  <Nav class="nav--login">
    <NavLink class="nav__link--title font-wide" to="/">
      <div class="nav__link__img__wrapper">
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
      </div>

      Keycap
    </NavLink>

    <NavLink href="/login" class="nav__link--login">
      Have an account ?
    </NavLink>
  </Nav>
</template>

<style lang="scss">
.nav {
  &--login {
    justify-content: space-between;
  }

  &__link {
    &--title {
      font-size: min(1rem + 1vw, 1.75rem);
    }

    &--login {
      font-weight: 400;
      text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
      text-underline-offset: 3px;
    }

    &__img {
      &__wrapper {
        --img-width: 1.5ch;

        position: relative;
        z-index: 1;
      }

      &--title {
        width: var(--img-width);

        margin-bottom: 0;

        @media (prefers-reduced-motion: no-preference) {
          animation: press 10s 5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
      }
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
