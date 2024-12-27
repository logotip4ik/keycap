<template>
  <button class="modal__close-button">
    <Icon name="close-rounded" class="modal__close-button__icon" />
  </button>
</template>

<style lang="scss">
.modal__close-button {
  --size: clamp(2rem, 3vw + 1.5rem, 2.5rem);

  display: inline-flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: calc(var(--size) / 6);
  right: calc(var(--size) / 6);

  width: var(--size);
  height: var(--size);

  border: none;
  border-radius: 0.2rem;
  outline: 1px transparent solid;
  outline-offset: -1px;
  background-color: transparent;

  cursor: pointer;

  transition: color, outline-color, outline-offset, background-color;
  transition-duration: .3s;

  @media (hover: hover) {
    color: hsla(var(--text-color-hsl), 0.65);
  }

  &:is(:hover, :focus-visible) {
    color: hsla(var(--text-color-hsl), 1);
    background-color: hsla(var(--selection-bg-color-hsl), 0.075);

    outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.45);
    outline-offset: 0px;

    transition-duration: .1s;

    @media (prefers-color-scheme: dark) {
      background-color: hsla(var(--selection-bg-color-hsl), 0.175);
      outline-color: hsla(var(--selection-bg-color-hsl), 0.65);
    }
  }

  &__icon {
    width: auto;
    height: 65%;
  }
}
</style>
