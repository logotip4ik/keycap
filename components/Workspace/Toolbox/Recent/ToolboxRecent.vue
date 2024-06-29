<script setup lang="ts">
import { useToolboxState } from '../config';

const { state } = useToolboxState();

const POLLING_TIME = parseDuration('5 minutes');
let pollingTimer: NodeJS.Timeout | undefined;

const { data: recent, refresh } = await useAsyncData('recent', async () => {
  clearTimeout(pollingTimer);

  const recent = await $fetch('/api/recent');
  pollingTimer = setTimeout(refresh, POLLING_TIME);

  return recent.data;
}, {
  server: false,
  lazy: true,
  immediate: false,
});

const stop = watch(state, (visibility) => {
  if (visibility !== 'hidden') {
    setTimeout(() => {
      refresh();
      stop();
    }, 0);
  }
}, { immediate: import.meta.client });
</script>

<template>
  <section class="toolbox__recent">
    <p class="toolbox__section__title">
      Recent:
    </p>

    <WithFadeTransition>
      <WorkspaceToolboxRecentSkeleton v-if="!recent" />

      <div v-else-if="recent.length === 0" class="toolbox__recent__empty">
        Seems to be empty ⚆_⚆
      </div>

      <ul v-else class="toolbox__section__list">
        <li
          v-for="item in recent"
          :key="item.id"
          class="toolbox__section__list__item"
        >
          <WorkspaceToolboxRecentItem
            :item="item"
            @keydown.enter="state = 'hidden'"
          >
            {{ item.name }}
          </WorkspaceToolboxRecentItem>
        </li>
      </ul>
    </WithFadeTransition>
  </section>
</template>

<style lang="scss">
.toolbox__recent {
  &__empty {
    font-size: 1.05rem;
    font-weight: 300;
    text-align: center;
    color: hsla(var(--text-color-hsl), 0.75);
  }
}
</style>
