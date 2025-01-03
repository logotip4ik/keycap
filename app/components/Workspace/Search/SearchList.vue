<script setup lang="ts">
const props = defineProps<{
  state: 'idle' | 'empty'
  animateEl: HTMLElement | undefined
}>();

let prevHeight: number;
function rememberHeight() {
  if (props.animateEl) {
    stopAnimations(props.animateEl);

    prevHeight = props.animateEl.clientHeight;
  }
}

function animateHeight() {
  if (!props.animateEl) {
    return;
  }

  const currentHeight = props.animateEl.clientHeight;

  props.animateEl.animate([
    { height: `${prevHeight}px` },
    { height: `${currentHeight}px` },
  ], { duration: 225, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });
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
