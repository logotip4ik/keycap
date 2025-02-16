<template>
  <div style="height: 48px; opacity: 0;" class="list__item--fallback">
    loading...
  </div>
</template>

<style lang="scss">
.list__item--fallback {
  color: hsla(var(--text-color-hsl), 0.5);

  padding: calc(var(--pd-y) * 0.75) calc(var(--pd-x));

  animation: show-fallback 0.4s 0.5s forwards;
}

@keyframes show-fallback {
  to { opacity: 1; }
}
</style>
