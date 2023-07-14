<template>
  <Nav>
    <NavLink class="nav__link--title font-wide" to="/">
      <img
        src="/favicon-32x32.png"
        alt="purple keycap"
        class="nav__link__img"
        fetchpriority="high"
        decoding="async"
        width="32"
        height="32"
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
  }
}
</style>
