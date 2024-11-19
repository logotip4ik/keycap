<template>
  <WithFadeTransition appear>
    <p role="note" class="no-connection-note">
      <Icon path="warning" /> No Connection
    </p>
  </WithFadeTransition>
</template>

<style lang="scss">
.no-connection-note {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  position: absolute;
  top: 1.5rem;
  left: 50%;

  font-size: 0.975rem;
  color: var(--error-color);

  transform: translateX(-50%);

  &::after {
    content: '';

    position: absolute;
    top: 50%;
    left: 50%;

    width: 120%;
    height: 100%;

    background-color: hsla(var(--error-color-hsl), 0.35);

    filter: blur(18px);
    transform: translate(-50%, -50%);
  }
}
</style>
