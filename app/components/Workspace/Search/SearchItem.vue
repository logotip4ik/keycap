<script setup lang="ts">
const props = defineProps<{
  item: FuzzyItem | CommandItem
  selected: boolean
}>();

const isCommand = 'key' in props.item;

let itemHref: string, itemPath: string;

if (!isCommand) {
  const user = getUser();

  itemHref = generateItemPath(props.item);
  itemPath = generateSearchRelativeItemPath(props.item.path, user.username);
}

async function handleActionClick() {
  if (!isCommand) {
    return;
  }

  const action = commandActions[props.item.key];

  await action?.();
}
</script>

<template>
  <button v-if="isCommand" class="search-item" :data-selected="selected" @click="handleActionClick">
    <span class="search-item__name">{{ item.name }}</span>
    <Icon name="round-keyboard-return" class="search-item__enter-icon" />
  </button>

  <NuxtLink v-else :href="itemHref" class="search-item" :data-selected="selected">
    <span v-if="itemPath !== ''" class="search-item__path">{{ itemPath }}/</span>
    <span class="search-item__name">{{ item.name }}</span>
    <Icon name="round-keyboard-return" class="search-item__enter-icon" />
  </NuxtLink>
</template>

<style lang="scss">
.search-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  position: relative;

  font: inherit;
  font-size: 1.25rem;
  color: currentColor;
  text-decoration: none;

  width: 100%;

  padding: 1rem 1.25rem;
  border-radius: 0.25rem;

  overflow: hidden;

  border: 1px solid hsla(var(--text-color-hsl), 0.075);
  outline: 0;
  background-color: hsla(var(--text-color-hsl), 0.01);

  backdrop-filter: blur(2px);
  transition: background-color .4s;
  cursor: pointer;

  &__name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &__path {
    white-space: nowrap;

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
    background-color: hsla(var(--selection-bg-color-hsl), 0.175);
    outline: none;

    transition: background-color .1s;

    .search-item__enter-icon {
      opacity: 1;

      transition: opacity .1s;
    }
  }
}
</style>
