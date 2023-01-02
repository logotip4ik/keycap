<script setup lang="ts">
import type { FolderOrNote } from '~/composables/store';

interface Props { item: FolderOrNote; selected: boolean }
const props = defineProps<Props>();

const itemPath = computed(() => {
  const path = props.item.path
    // removing account name
    .replace(/\/\w+\//i, '')
    // the last one string from path
    .replace(/\/?[\w\%]+$/i, '');

  return decodeURIComponent(path);
});
</script>

<template>
  <NuxtLink :href="generateItemRouteParams(item)" class="search-item" :data-selected="selected">
    <span v-if="itemPath !== ''" class="search-item__path">{{ itemPath }}/</span>
    <span class="search-item__name">{{ item.name }}</span>
    <Icon name="ic:round-keyboard-return" class="search-item__enter-icon" />
  </NuxtLink>
</template>

<style lang="scss" scoped>
.search-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  position: relative;

  font-size: 1.25rem;
  color: currentColor;
  text-decoration: none;

  width: 100%;

  padding: 1rem 1.25rem;
  border-radius: 0.25rem;

  overflow: hidden;

  background-color: hsla(var(--text-color-hsl), 0.01);

  transition: background-color .4s;

  &__name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &__path {
    opacity: 0.25;
  }

  &__enter-icon {
    font-size: 2rem;

    margin-left: auto;
    padding-left: 0.25rem;

    opacity: 0;

    transition: opacity .4s;
  }

  &:is(:hover, :focus-visible, [data-selected="true"]) {
    background-color: hsla(var(--hsl-primary-color), 35%, 50% ,0.1);
    outline: none;

    transition: background-color .1s;

    .search-item__enter-icon {
      opacity: 1;

      transition: opacity .1s;
    }
  }
}
</style>
