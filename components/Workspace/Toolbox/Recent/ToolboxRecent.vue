<script setup lang="ts">
import { useToolboxState } from '../config';

const createToast = useToaster();
const { state } = useToolboxState();

const recent = shallowRef<Array<NoteMinimal>>();

const POLLING_TIME = parseDuration('5 minutes');
const RETRY_TIME = parseDuration('5s');
const MAX_RETRY = 10;

let pollingTimer: ReturnType<typeof setTimeout> | undefined;
let retryingToast: ToastInstance | undefined;

async function fetchRecent(retry: number = 0): Promise<void> {
  clearTimeout(pollingTimer);

  $fetch('/api/recent')
    .then(async (response) => {
      const hydrationPromise = getHydrationPromise();

      if (hydrationPromise) {
        await hydrationPromise;
      }

      if (retryingToast) {
        retryingToast?.remove();
        retryingToast = undefined;
      }

      recent.value = response.data;
      pollingTimer = setTimeout(fetchRecent, POLLING_TIME);
    })
    .catch(() => {
      if (!retryingToast) {
        retryingToast = createToast('Failed fetching recent notes. Retrying...', {
          type: 'loading',
          duration: Infinity,
        });
      }

      const nextRetry = retry + 1;
      if (nextRetry <= MAX_RETRY) {
        setTimeout(fetchRecent, RETRY_TIME, retry + 1);
      }
      else {
        retryingToast.remove();
        createToast('Can\'t fetch recents, please try reloading the website if needed.');
      }
    });
};

const stop = watchEffect(() => {
  if (state.value === 'hidden') {
    return;
  }

  fetchRecent();
  nextTick(() => {
    stop();
  });
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
