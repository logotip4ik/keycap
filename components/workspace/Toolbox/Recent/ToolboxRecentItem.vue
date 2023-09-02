<script setup lang="ts">
interface Props { item: NoteMinimal }
const props = defineProps<Props>();

const isSmallScreen = inject(IsSmallScreenKey);
const toolboxSidebarState = useToolboxSidebarState();

const itemHref = computed(() => generateItemPath(props.item));

function unpinIfNeeded() {
  if (isSmallScreen)
    toolboxSidebarState.value = 'hidden';
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

  position: relative;
  z-index: 1;

  font-size: 1.025rem;
  font-weight: 300;
  color: currentColor;
  text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
  text-underline-offset: 3px;

  &::after {
    content: '';

    position: absolute;
    top: 100%;
    left: 0;
    z-index: -1;

    width: 100%;
    height: 2px;

    opacity: 0;
    background-color: var(--task-list-indicator-color);

    pointer-events: none;
    transition: opacity .1s;
  }

  transition: border-bottom-width .1s;

  &:focus-visible {
    color: var(--text-color);

    outline: none;

    &::after {
      opacity: 1;
    }
  }
}
</style>
