<script setup lang="ts">
defineProps<{ top?: string }>();
</script>

<template>
  <slot class="_blob" :style="{ '--t': top }" />
</template>

<style lang="scss">
._blob::after {
  --appear-animation: appear 2s 0.5s ease-out forwards;
  --size: 20vmin;
  --blur-divider: 1.75;

  content: "";

  position: absolute;
  top: var(--t, 75%);
  right: 7.5%;
  z-index: -1;

  width: var(--size);
  height: var(--size);

  border-radius: 50%;
  background-color: var(--task-list-indicator-color);

  opacity: 0;
  animation: var(--appear-animation);
  filter: blur(calc(var(--size) / var(--blur-divider)));

  @media (prefers-reduced-motion: no-preference) {
    animation: var(--appear-animation), blob-anim 20s infinite linear alternate;
  }

  @media (max-width: $breakpoint-tablet) {
    --size: 30vmin;
    --blur-divider: 2;
  }
}

@keyframes appear {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes blob-anim {
  0% {
    width: 20vmin;
    height: 20vmin;

    transform: translate(0px, 0px) rotate(0deg);
  }

  25% {
    width: 25vmin;
    height: 20vmin;

    transform: translate(1vmax, 0px) rotate(0deg);
  }

  50% {
    width: 25vmin;
    height: 30vmin;

    transform: translate(0.5vmax -1vmax) rotate(0deg);
  }

  75% {
    width: 20vmin;
    height: 22.5vmin;

    transform: translate(-1vmax, 1vmax) rotate(0deg);
  }

  100% {
    width: 25vmin;
    height: 21.5vmin;

    transform: translate(-0.5vmax, 0.25vmax) rotate(0deg);
  }
}
</style>
