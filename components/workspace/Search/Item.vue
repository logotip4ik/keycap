<script setup lang="ts">
import { withLeadingSlash } from 'ufo';

import type { FolderOrNote } from '~/composables/store';

import { blankNoteName } from '~/assets/constants';

interface Props { item: FolderOrNote }
const props = defineProps<Props>();

const itemPath = computed(() =>
  // removing account name and the last one string from path
  decodeURIComponent(props.item.path.replace(/\/\w+/i, '').replace(/\/[\w\%]+$/i, '')));

function generatePathFromItem(item: FolderOrNote) {
  const isFolder = 'root' in item;

  const path = item.path.replace('/', '/@');

  return isFolder ? path + withLeadingSlash(blankNoteName) : path;
}
</script>

<template>
  <NuxtLink :href="generatePathFromItem(item)" class="search-item">
    <span v-if="itemPath !== ''" class="search-item__path">{{ itemPath }}/</span>
    <span class="search-item__name">{{ item.name }}</span>
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
  text-overflow: ellipsis;
  text-decoration: none;
    white-space: nowrap;
  width: 100%;

  padding: 1rem 1.25rem;
  border-radius: 0.25rem;

  overflow: hidden;

  transition: background-color .3s;

  &__path {
    opacity: 0.25;
  }

  &:is(:hover, :focus-visible) {
    background-color: hsla(var(--text-color-hsl), 0.05);
    outline: none;

    transition: background-color .1s;
  }
}
</style>
