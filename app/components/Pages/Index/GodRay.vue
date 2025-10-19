<template>
  <div class="god-rays">
    <div class="god-rays__ray" />
  </div>
</template>

<style lang="scss">
// Credits to Stunning UI - https://www.stunningui.design/components/god-ray
.god-rays {
  --ray-bg: var(--surface-color);

  --stripes: repeating-linear-gradient(
    100deg,
    var(--ray-bg) 0%,
    var(--ray-bg) 7%,
    transparent 10%,
    transparent 12%,
    var(--ray-bg) 16%
  );
  --aurora: repeating-linear-gradient(
    100deg,
    #3b82f6 10%,
    #a5b4fc 15%,
    #93c5fd 20%,
    #ddd6fe 25%,
    #60a5fa 30%
  );

  display: flex;

  position: absolute;
  top: 0;
  z-index: -3;

  height: 76vh;
  height: 76svh;
  width: 100%;

  opacity: 0;
  background-color: var(--ray-bg);
  transition: background-color 0.3s;
  animation: ray-appear 3s 0.5s ease-out forwards;

  &__ray {
    position: absolute;
    inset: 0;

    opacity: 0.5;
    background-image: var(--stripes), var(--aurora);
    background-size: 300%, 200%;
    background-position: 50% 50%, 50% 50%;

    filter: blur(10px) invert(100%);
    mask-image: radial-gradient(ellipse at 100% -10%, black 40%, transparent 70%);
    pointer-events: none;
    transform: translate3d(0, 0, 0);

    &::after {
      content: '';

      position: absolute;
      inset: 0;

      background-image: var(--stripes), var(--aurora);
      background-size: 200%, 100%;

      background-attachment: fixed;
      mix-blend-mode: difference;
      animation: ray 60s linear infinite;

      @media screen and (prefers-color-scheme: dark) {
        filter: blur(12px) invert(10%);
        transform: translate3d(0, 0, 0);
      }
    }

    @media screen and (prefers-color-scheme: dark) {
      filter: blur(12px) invert(10%);
    }
  }
}

@keyframes ray-appear {
  from {
    opacity: 0;
    transform: rotate(0);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: rotate(0);
    filter: none;
  }
}

@keyframes ray {
  from {
    background-position: 50% 50%, 50% 50%;
  }

  to {
    background-position: 350% 50%, 350% 50%;
  }
}
</style>
