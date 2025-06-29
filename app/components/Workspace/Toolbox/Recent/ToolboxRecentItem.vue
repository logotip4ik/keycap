<script setup lang="ts">
import { useToolboxState } from '../config';

const props = defineProps<{
  item: NoteMinimal
}>();

const { isSmallScreen } = useDevice();
const { state } = useToolboxState();

const itemHref = computed(() => generateItemPath(props.item));

function unpinIfNeeded() {
  if (isSmallScreen.value) {
    state.value = 'hidden';
  }
}
</script>

<template>
  <NuxtLink
    :href="itemHref"
    class="recent-item"
    :aria-label="`open note '${item.name}'`"
    @click="unpinIfNeeded"
  >
    <slot />
  </NuxtLink>
</template>

<style lang="scss">
.recent-item {
  display: block;

  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  color: hsla(var(--text-color-hsl), 0.85);

  height: 100%;
  width: 100%;

  padding: calc(var(--pd-y) / 1.65) calc(var(--pd-x) / 2);

  border: 1px solid hsla(var(--text-color-hsl), 0.075);
  border-radius: 0.2rem;
  background-color: hsla(var(--text-color-hsl), 0.015);

  overflow: hidden;
  cursor: pointer;

  transform: rotate(0);
  transition: color, border-color, background-color, transform;
  transition-duration: .4s;

  &:is(:hover, :focus-visible) {
    color: hsla(var(--text-color-hsl), 1);
    background-color: hsla(var(--selection-bg-color-hsl), 0.1);
    border-color: hsla(var(--selection-bg-color-hsl), 0.75);

    transition-duration: .1s;

    @media (prefers-color-scheme: dark) {
      background-color: hsla(var(--selection-bg-color-hsl), 0.275);
      border-color: hsla(var(--selection-bg-color-hsl), 0.65);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
