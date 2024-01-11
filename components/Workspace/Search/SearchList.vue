<script setup lang="ts">
const props = defineProps<{
  state: 'idle' | 'empty'
  animateEl: HTMLElement | undefined
}>();

let prevHeight: number;
let prevAnimation: Animation | null;
function rememberHeight() {
  if (props.animateEl)
    prevHeight = props.animateEl.clientHeight;
}

function animateHeight() {
  if (!props.animateEl)
    return;

  if (prevAnimation)
    prevAnimation.cancel();

  const currentHeight = props.animateEl.clientHeight;

  prevAnimation = props.animateEl.animate([
    { height: `${prevHeight}px` },
    { height: `${currentHeight}px` },
  ], { duration: 225, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });

  prevAnimation.addEventListener('finish', () => prevAnimation = null);
}
</script>

<template>
  <WithFadeTransition
    @enter="animateHeight"
    @leave="animateHeight"
    @before-enter="rememberHeight"
    @before-leave="rememberHeight"
  >
    <div
      v-if="state === 'empty'"
      class="search__no-results"
    >
      <p class="search__no-results__text">
        Nothing found...
      </p>
    </div>

    <WithListTransitionGroup
      v-if="state === 'idle'"
      tag="ul"
      class="search__results"
      @enter="animateHeight"
      @leave="animateHeight"
      @before-enter="rememberHeight"
      @before-leave="rememberHeight"
    >
      <slot />
    </WithListTransitionGroup>
  </WithFadeTransition>
</template>
