<script setup lang="ts">
import { useToolboxState } from '../config';

const createToast = useToaster();
const { state } = useToolboxState();

const POLLING_TIME = parseDuration('5 minutes')!;

const { data: recent } = useKFetch<Array<NoteMinimal>>('/api/recent', {
  getCached: () => undefined,
  pollingTime: POLLING_TIME,
  watch: [state],
  skip: computed(() => state.value === 'hidden'),
  getErrorToast: () => createToast('Failed fetching recent notes.'),
});
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

      <WithListTransitionGroup
        v-else
        tag="ul"
        class="toolbox__section__list"
      >
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
      </WithListTransitionGroup>
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
