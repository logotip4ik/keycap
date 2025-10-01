<script setup lang="ts">
const props = defineProps<{
  state: 'idle' | 'empty'
  animateEl: HTMLElement | undefined
}>();

const animateEl = computed(() => props.animateEl);
const { rememberSize, animateSize } = getContainerDimensionsTransition(animateEl);
</script>

<template>
  <WithFadeTransition
    @enter="animateSize"
    @leave="animateSize"
    @before-enter="rememberSize"
    @before-leave="rememberSize"
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
      @enter="animateSize"
      @leave="animateSize"
      @before-enter="rememberSize"
      @before-leave="rememberSize"
    >
      <slot />
    </WithListTransitionGroup>
  </WithFadeTransition>
</template>
