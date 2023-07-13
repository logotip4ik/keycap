<template>
  <small class="form__input__note">
    <slot />
  </small>
</template>

<style lang="scss">
.form__input__note {
  display: inline-block;

  color: hsla(var(--text-color-hsl), 0.75);

  max-width: 33ch;

  margin-block: 0.25rem;
}
</style>
