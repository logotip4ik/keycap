<template>
  <Nav>
    <NavLink class="nav__link--title font-wide" to="/">
      <img
        src="/logo.webp"
        alt="purple keycap"
        class="nav__link__img"
        decoding="async"
        width="48"
        height="48"
        fetchpriority="low"
        loading="lazy"
      >
      Keycap
    </NavLink>
  </Nav>
</template>

<style lang="scss">
.nav__link {
  &--title {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    font-size: min(1rem + 1vw, 1.75rem);
  }
}
</style>
