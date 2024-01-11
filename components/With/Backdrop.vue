<template>
  <div class="backdrop">
    <slot />
  </div>
</template>

<style lang="scss">
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 10;

  background-color: hsla(var(--surface-color-hsl), 0.9);

  @media (max-width: $breakpoint-tablet) {
    align-items: stretch;
  }

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.25);
    backdrop-filter: blur(8px);
  }
}
</style>
