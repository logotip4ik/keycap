<script setup lang="ts">
import type { SidebarState } from '~/composables/sidebars';

interface Props { state: SidebarState }
const props = defineProps<Props>();

const visibleStates = ['visible', 'pinned'] satisfies Array<SidebarState>;

const { data: recent, refresh } = await useAsyncData('recent', async () => {
  preloadComponents('WorkspaceToolboxRecentItem');

  const recent = await $fetch<Array<NoteMinimal>>('/api/recent');

  return recent;
}, {
  server: false,
  lazy: true,
  immediate: false,
});

const stop = watch(() => props.state, (state) => {
  if (visibleStates.includes(state)) {
    setTimeout(() => {
      refresh();
      stop();
    }, 0);
  }
}, { immediate: import.meta.client });
</script>

<template>
  <Transition name="fade">
    <div v-if="!recent" key="1">
      loading...
    </div>

    <div
      v-else
      key="2"
      class="toolbox__recent"
    >
      <p class="toolbox__recent__title">
        Recent:
      </p>

      <ul class="toolbox__recent__list">
        <li
          v-for="item in recent"
          :key="item.id"
          class="toolbox__recent__list__item"
        >
          <LazyWorkspaceToolboxRecentItem :item="item">
            {{ item.name }}
          </LazyWorkspaceToolboxRecentItem>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<style lang="scss">
.toolbox__recent {
  &__title {
    font-size: 1.15rem;
    font-stretch: 105%;
    color: hsla(var(--text-color-hsl), 0.875);

    margin: calc(var(--pd-y) * 0.75) 0 var(--pd-y);
  }

  &__list {
    --spacing: calc(var(--pd-y) * 0.66);

    margin: var(--spacing) 0 0;
    padding: 0 0 0 var(--pd-x);

    list-style-type: disc;

    &__item {
      color: hsla(var(--text-color-hsl), 0.75);

      transition: color .3s, filter .3s;

      &::marker {
        color: currentColor;
      }

      &:hover {
        color: var(--text-color);
        filter: drop-shadow(0 0 0.5rem hsla(var(--text-color-hsl), 0.35));

        transition-duration: .1s;
      }

      &:not(:first-child) {
        margin-top: var(--spacing);
      }
    }
  }
}
</style>
