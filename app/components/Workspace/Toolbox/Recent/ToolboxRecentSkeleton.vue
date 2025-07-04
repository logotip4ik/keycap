<template>
  <div class="skeleton recent-skeleton" />
</template>

<style lang="scss">
.recent-skeleton {
  display: flex;
  justify-content: center;
  align-items: flex-end;

  position: relative;

  height: 5rem;

  &::after {
    --size: 2rem;

    content: '';

    width: var(--size);
    height: var(--size);

    border-radius: 50%;
    border: 2px solid transparent;
    border-left-color: currentColor;
    border-right-color: currentColor;

    opacity: 0.65;
    animation: spin 1s infinite linear;
  }
}
</style>
