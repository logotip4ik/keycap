<template>
  <footer class="note-view__footer">
    <NuxtLink href="/register" class="note-view__footer__link">
      Want an account ?
    </NuxtLink>
  </footer>
</template>

<style lang="scss">
.note-view__footer {
  width: fit-content;
  margin: auto auto 0;
  padding: 15vh 0 7.5vh;

  &__link {
    text-decoration: none;
    font-weight: 400;
    text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
    text-underline-offset: 3px;
    color: hsla(var(--text-color-hsl), 0.75);

    margin: 0;

    transition: color .3s;

    &:is(:hover, :focus-visible) {
      color: currentColor;

      transition: color .1s
    }
  }
}
</style>
