<template>
  <Nav class="nav--login">
    <NavLink class="nav__link--title font-wide" to="/">
      <div class="nav__link__img__wrapper">
        <img
          src="/logo.webp"
          alt="purple keycap"
          class="nav__link__img nav__link__img--title nav__link__img--blur"
          decoding="async"
          width="48"
          height="48"
          fetchpriority="low"
          loading="lazy"
        >

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
      font-size: min(calc(1rem + 1vw), 1.75rem);
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

      &--blur {
        position: absolute;
        z-index: -1;
        opacity: 0.25;
        filter: blur(16px);
      }

      &--title {
        width: var(--img-width);

        margin-bottom: 0;

      }
    }
  }
}
</style>
