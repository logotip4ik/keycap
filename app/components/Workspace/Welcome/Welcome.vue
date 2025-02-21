<template>
  <div class="welcome">
    <p class="welcome__title font-wide">
      Welcome back
    </p>
  </div>
</template>

<style lang="scss">
.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  padding: 1.75rem;

  &__title {
    font-size: min(6vw, 3.5rem);
    max-width: 33ch;
    color: hsla(var(--text-color-hsl), 0.15);
    text-align: center;

    position: relative;

    text-shadow: 0 0 1px hsla(var(--selection-bg-color-hsl), 0.33);

    user-select: none;
  }
}
</style>
