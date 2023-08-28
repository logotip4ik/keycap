<script setup lang="ts">
import parseDuration from 'parse-duration';

import type { SidebarState } from '~/composables/sidebars';

interface Props { state: SidebarState}
const props = defineProps<Props>();

const route = useRoute();
const isFallbackMode = useFallbackMode();
const foldersCache = useFoldersCache();
const offlineStorage = useOfflineStorage();
const createToast = useToast();
const detailsItem = useCurrentItemForDetails();
const mitt = useMitt();
const { shortcuts } = useAppConfig();

const folderApiPath = computed(() => {
  return Array.isArray(route.params.folders) && route.params.folders.length > 0
    ? `/${route.params.folders.map(encodeURIComponent).join('/')}`
    : '';
});

const menuOptions = shallowReactive({
  item: null as FolderOrNote | null,
  target: null as HTMLElement | null,
});

const POLLING_TIME = parseDuration('2.5 minutes')!;
let pollingTimer: NodeJS.Timeout;
let abortControllerGet: AbortController | null;

const { data: folder, refresh } = await useAsyncData<FolderWithContents | undefined>('folder', async () => {
  if (import.meta.server || props.state === 'hidden')
    return;

  clearTimeout(pollingTimer);

  abortControllerGet?.abort();
  abortControllerGet = new AbortController();

  $fetch<FolderWithContents>(`/api/folder${folderApiPath.value}`, { signal: abortControllerGet.signal })
    .then((fetchedFolder) => {
      if (!fetchedFolder) return;

      isFallbackMode.value = false;

      folder.value = fetchedFolder;
      foldersCache.set(fetchedFolder.path, fetchedFolder);
      offlineStorage.setItem?.(fetchedFolder.path, fetchedFolder);
    })
    .catch((e) => createToast(e.message)) // TODO: better error handling and error messages
    .finally(() => {
      const multiplier = document.visibilityState === 'visible' ? 1 : 2;
      pollingTimer = setTimeout(refresh, POLLING_TIME * multiplier);
    });

  const folderPath = `/${route.params.user}${folderApiPath.value}`;

  return foldersCache.get(folderPath) || await offlineStorage.getItem?.(folderPath);
}, {
  server: false,
  immediate: false,
  lazy: true,
  watch: [folderApiPath],
});

const folderContents = computed(() => {
  if (!folder.value) return [];

  return folder.value.notes.concat(folder.value.subfolders) as Array<FolderOrNote>;
});

function showMenu(target: HTMLElement, item: FolderOrNote) {
  if (isFallbackMode.value) return;

  menuOptions.item = item;
  menuOptions.target = target;
}

watch(() => props.state, (state, oldState) => {
  if (
    sidebarVisibleStates.includes(state)
    && (!oldState || oldState === 'hidden')
    && !folder.value
  )
    return refresh();
}, { immediate: import.meta.client });

if (import.meta.client) {
  onBeforeUnmount(on(document, 'visibilitychange', () => {
    if (document.visibilityState === 'visible')
      refresh();
  }));
};

mitt.on('cache:populated', () => {
  const folderPath = `/${route.params.user}${folderApiPath.value}`;

  folder.value = foldersCache.get(folderPath) || null;
});

// TODO: rework details trigger ?
mitt.on('details:show', () => {
  // const noNote = !route.params.note || route.params.note === BLANK_NOTE_NAME;

  // if (folder.value && noNote)
  // detailsItem.value = { };
});

useTinykeys({
  [shortcuts.new]: (event) => {
    event.preventDefault();

    if (folder.value) preCreateItem(folder.value);
  },
});

onMounted(() => {
  setTimeout(() => {
    requestIdleCallback(() => {
      // Do we need this, if service worker already should have cached this items ?
      preloadComponents([
        'WorkspaceContentsListItem',
        'WorkspaceContentsListItemInput',
        'WorkspaceContentsListMenu',
      ]);
    });
  }, 550);
});

onBeforeUnmount(() => {
  abortControllerGet?.abort();
});
</script>

<template>
  <Transition name="fade">
    <WorkspaceContentsListSkeleton
      v-if="!folder"
    />

    <div
      v-else-if="folderContents.length === 0"
      class="contents__empty"
    >
      No notes here yet (⌒‿⌒)
    </div>

    <TransitionGroup
      v-else
      tag="ul"
      name="list"
      class="contents__list"
      tabindex="-1"
      @contextmenu.self.prevent
      @click.self="menuOptions.target = null"
    >
      <li
        v-for="item in folderContents"
        :key="item.id"
        class="contents__list__item"
      >
        <Transition name="fade">
          <Suspense>
            <LazyWorkspaceContentsListItemInput
              v-if="item.creating || item.editing"
              :item="item"
              :parent="folder"
            />

            <LazyWorkspaceContentsListItem
              v-else
              :item="item"
              :parent="folder"
              :menu-target="menuOptions.target"
              @show-menu="showMenu($event, item)"
            />
          </Suspense>
        </Transition>
      </li>
    </TransitionGroup>
  </Transition>

  <LazyWorkspaceContentsListMenu
    v-if="menuOptions.item"
    :item="menuOptions.item"
    :target="menuOptions.target!"
    :parent="folder!"
    @close="menuOptions.item = null"
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
