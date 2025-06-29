<template>
  <Transition name="modal">
    <slot />
  </Transition>
</template>

<style lang="scss">
$second-child-selector: '*:first-of-type > *:first-of-type';

.modal-enter-active {
  transition: opacity 0.075s;
}

.modal-leave-active,
.modal-leave-active #{$second-child-selector} {
  transition: opacity 0.125s ease, transform 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  #{$second-child-selector} {
    transform: scale(0.95);
  }
}

@media (width <= $breakpoint-tablet) {
  .modal-leave-to {
    #{$second-child-selector} {
      transform: none;
    }
  }
}
</style>
