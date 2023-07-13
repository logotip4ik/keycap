<template>
  <p class="form__title font-wide">
    <slot />
  </p>
</template>

<style lang="scss">
.form__title {
  font-size: calc(1.25rem + 1vw);
  font-weight: 500;
  text-align: left;

  margin: 0 0 2.5rem 0;
}
</style>
