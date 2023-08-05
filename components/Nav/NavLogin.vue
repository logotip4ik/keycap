<template>
  <Nav>
    <NavLink href="/login" class="nav__link--login">
      Have an account ?
    </NavLink>
  </Nav>
</template>

<style lang="scss">
.nav__link {
  &--login {
    font-weight: 400;
    text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
    text-underline-offset: 3px;
  }
}
</style>
