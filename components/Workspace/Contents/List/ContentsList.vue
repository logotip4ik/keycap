<script setup lang="ts">
import { useContentsState } from '../config';

const route = useRoute();
const isFallbackMode = useFallbackMode();
const foldersCache = useFoldersCache();
const offlineStorage = useOfflineStorage();
const createToast = useToaster();
const user = useUser();
const { shortcuts } = useAppConfig();
const { state: contentsState } = useContentsState();

const folderApiPath = computed(() => getCurrentFolderPath(route).slice(0, -1));
const folderPath = computed(() => `/${user.value!.username}${folderApiPath.value}`);

const menuOptions = shallowReactive({
  item: undefined as FolderOrNote | undefined,
  target: undefined as HTMLElement | undefined,
});

const POLLING_TIME = parseDuration('2.5 minutes')!;
let pollingTimer: NodeJS.Timeout;
let abortControllerGet: AbortController | undefined;
let lastRefetch: number | undefined;

const { data: folder, refresh } = await useAsyncData<FolderWithContents | undefined>('folder', async () => {
  clearTimeout(pollingTimer);

  abortControllerGet?.abort();
  abortControllerGet = new AbortController();

  lastRefetch = Date.now();

  let hydrationPromise = getHydrationPromise();

  $fetch(`/api/folder${folderApiPath.value}`, { signal: abortControllerGet.signal })
    .then(async (res) => {
      if (!res) {
        return;
      }

      const { data: fetchedFolder } = res as { data: FolderWithContents };
      const wasCreatingItem = folder.value?.notes.some((item) => item.state === ItemState.Creating);

      isFallbackMode.value = false;

      foldersCache.set(fetchedFolder.path, fetchedFolder);
      offlineStorage.setItem(fetchedFolder.path, fetchedFolder);

      if (hydrationPromise) {
        await hydrationPromise;
        hydrationPromise = undefined;
      }

      folder.value = fetchedFolder;

      if (wasCreatingItem) {
        preCreateItem(folder.value);
      }
    })
    .catch((e) => {
      handleError(e);
      throw e;
    })
    .finally(() => {
      const multiplier = document.visibilityState === 'visible' ? 1 : 2;
      pollingTimer = setTimeout(refresh, POLLING_TIME * multiplier);
    });

  const cachedFolder = foldersCache.get(folderPath.value) || await offlineStorage.getItem(folderPath.value);

  if (hydrationPromise) {
    await hydrationPromise;
    hydrationPromise = undefined;
  }

  return cachedFolder;
}, {
  server: false,
  immediate: false,
  lazy: true,
  deep: true, // TODO: make it work with `deep: false`
  watch: [folderApiPath],
});

const folderContents = computed(() => {
  if (!folder.value) {
    return [];
  }

  const notes = folder.value.notes || [];
  const subfolders = folder.value.subfolders || [];

  return notes.concat(subfolders) as Array<FolderOrNote>;
});

function showMenu(target: HTMLElement, item: FolderOrNote) {
  if (isFallbackMode.value) {
    return;
  }

  menuOptions.item = item;
  menuOptions.target = target;
}

async function handleError(error: Error) {
  if (await baseHandleError(error) || folder.value) {
    createToast('Failed to fetch current folder, showing cached one.');
    return;
  }

  // last chance to show user folder, if iterator in @[user].vue page hasn't yet set the foldersCache
  const offlineFolder = await offlineStorage.getItem(folderPath.value);

  if (!offlineFolder || typeof offlineFolder !== 'object') {
    createToast(`Sorry ⊙︿⊙ We couldn't find offline copy for folder: "${route.params.folders.at(-1)}"`);

    await navigateTo(`/@${user.value!.username}`);

    return;
  }

  folder.value = offlineFolder as FolderWithContents;
}

function handleArrowsPress(event: KeyboardEvent) {
  const diff = event.key === 'ArrowUp'
    ? -1
    : event.key === 'ArrowDown'
      ? +1
      : 0;

  const listElement = (event.target as HTMLElement).offsetParent;

  if (!diff || !listElement) {
    return;
  }

  const currentIdx = Array.from(listElement.children)
    .findIndex((node) =>
      // event.target will be anchor tag, but it is wrapped in li, which is list element child
      node === (event.target as HTMLElement).parentElement,
    );

  const newSelectedResult = (currentIdx + diff) % listElement.childElementCount;
  const loopedNewSelectedResult = newSelectedResult < 0 ? listElement.childElementCount - 1 : newSelectedResult;
  const elementToFocus = listElement.children[loopedNewSelectedResult].firstElementChild as HTMLElement | undefined;

  elementToFocus?.focus();
}

watch(contentsState, (state, oldState) => {
  if (
    state !== 'hidden'
    && (!oldState || oldState === 'hidden')
    && !folder.value
  ) {
    return refresh();
  }
}, { immediate: import.meta.client });

// TODO: rework details trigger ?
// mitt.on('details:show', () => {
//   // const noNote = !route.params.note || route.params.note === BLANK_NOTE_NAME;

//   // if (folder.value && noNote)
//   // detailsItem.value = { };
// });

useTinykeys({
  [shortcuts.new]: async (event) => {
    event.preventDefault();

    if (contentsState.value === 'hidden') {
      contentsState.value = 'visible';
    }

    const alreadyCreating = folder.value
      && folder.value.notes.some((note) => note.state === ItemState.Creating);

    if (alreadyCreating) {
      return;
    }

    const stop = watchEffect(() => {
      if (folder.value) {
        preCreateItem(folder.value);
        nextTick(() => stop());
      }
    }, { flush: 'sync' });
  },
});

if (import.meta.client) {
  const offVisibilityChange = on(document, 'visibilitychange', () => {
    const timeDiff = Date.now() - (lastRefetch || 0);

    if (
      document.visibilityState === 'visible'
      && contentsState.value !== 'hidden'
      && timeDiff > parseDuration('15 seconds')!
    ) {
      refresh();
    }
  });

  onBeforeUnmount(() => {
    offVisibilityChange();
    abortControllerGet?.abort();
  });
};
</script>

<template>
  <WithFadeTransition>
    <WorkspaceContentsListSkeleton
      v-if="!folder"
    />

    <div
      v-else-if="folderContents.length === 0"
      class="contents__empty"
    >
      No notes here yet (⌒‿⌒)
    </div>

    <WithListTransitionGroup
      v-else
      tag="ul"
      class="contents__list"
      tabindex="-1"
      @contextmenu.self.prevent
      @click.self="menuOptions.target = undefined"
      @keydown.capture.passive="handleArrowsPress"
    >
      <template v-for="item in folderContents" :key="item.id">
        <WithFadeTransition>
          <li
            v-if="item.state"
            key="1"
            class="contents__list__item"
          >
            <LazyWorkspaceContentsListItemInput
              :item="item"
              :parent="folder"
            />
          </li>

          <li
            v-else
            key="2"
            class="contents__list__item"
          >
            <LazyWorkspaceContentsListItem
              :item="item"
              :parent="folder"
              :menu-target="menuOptions.target"
              @show-menu="showMenu($event, item)"
            />
          </li>
        </WithFadeTransition>
      </template>
    </WithListTransitionGroup>
  </WithFadeTransition>

  <LazyWorkspaceContentsListMenu
    v-if="menuOptions.item"
    :item="menuOptions.item"
    :target="menuOptions.target!"
    :parent="folder!"
    @close="menuOptions.item = undefined"
  />
</template>

<style lang="scss">
.contents__empty {
  font-size: 1.125rem;
  text-align: center;
  color: hsla(var(--text-color-hsl), 0.75);

  padding-top: var(--pd-y);
}

.contents__list {
  --scrollbar-thumb-color: hsla(var(--text-color-hsl), 0.175);
  --scrollbar-background: var(--surface-color);
  --items-spacing: calc(var(--pd-y) / 5);

  position: relative;

  height: 100%;

  margin: 0;
  margin-right: calc(-1 * var(--pd-x));
  margin-bottom: calc(-1 * var(--pd-y));

  padding: 0 calc(var(--pd-x)) var(--pd-y) 0;

  list-style-type: none;

  overflow-y: auto;
  scroll-snap-type: y proximity;

  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-background);

  &::-webkit-scrollbar {
    width: 0.5rem;

    background: var(--scrollbar-background);
  }

  &::-webkit-scrollbar-thumb {
    width: 0.5rem;

    background-color: var(--scrollbar-thumb-color);
  }

  &__item {
    scroll-snap-align: start;

    margin-top: var(--items-spacing);
  }
}
</style>
