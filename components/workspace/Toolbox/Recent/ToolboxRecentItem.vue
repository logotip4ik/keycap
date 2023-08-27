<script setup lang="ts">
interface Props { item: NoteMinimal }
const props = defineProps<Props>();

const itemHref = computed(() => generateItemPath(props.item));
</script>

<template>
  <NuxtLink :href="itemHref" class="recent-item">
    <slot />
  </NuxtLink>
</template>

<style lang="scss">
.recent-item {
  display: block;

  font-size: 1.025rem;
  font-weight: 300;
  color: currentColor;
  text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
  text-underline-offset: 3px;
}
</style>
