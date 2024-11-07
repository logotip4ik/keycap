<template>
  <p class="form__title font-wide">
    <slot />
  </p>
</template>

<style lang="scss">
.form__title {
  font-size: min(calc(1.5rem + 0.75vw), 2rem);
  font-weight: 500;
  text-align: left;

  margin: 0 0 2.5rem 0;
}
</style>
