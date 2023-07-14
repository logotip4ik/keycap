<template>
  <nav class="nav">
    <slot />
  </nav>
</template>

<style lang="scss">
.nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  position: absolute;
  z-index: 10;
  left: 50%;
  top: calc(2.5vh + 1vw);

  width: 93%;
  max-width: 1200px;

  padding: 1rem 1rem;

  transform: translateX(-50%);
}
</style>
