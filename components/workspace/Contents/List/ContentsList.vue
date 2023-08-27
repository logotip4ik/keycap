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

const visibleStates = ['visible', 'pinned'] satisfies Array<SidebarState>;
const POLLING_TIME = parseDuration('2.5 minutes')!;
let pollingTimer: NodeJS.Timeout;

const { data: folder, refresh } = await useAsyncData<FolderWithContents | undefined>('folder', async () => {
  if (import.meta.server || props.state === 'hidden')
    return;

  clearTimeout(pollingTimer);

  $fetch<FolderWithContents>(`/api/folder${folderApiPath.value}`)
    .then((fetchedFolder) => {
      if (!fetchedFolder) return;

      isFallbackMode.value = false;

      folder.value = fetchedFolder;
      foldersCache.set(fetchedFolder.path, fetchedFolder);
      offlineStorage.value?.setItem(fetchedFolder.path, fetchedFolder);
    })
    .catch((e) => createToast(e.message)) // TODO: better error handling and error messages
    .finally(() => {
      const multiplier = document.visibilityState === 'visible' ? 1 : 2;
      pollingTimer = setTimeout(refresh, POLLING_TIME * multiplier);
    });

  const folderPath = `/${route.params.user}${folderApiPath.value}`;

  return foldersCache.get(folderPath) || await offlineStorage.value?.getItem(folderPath);
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
    visibleStates.includes(state)
    && (!oldState || oldState === 'hidden')
    && !folder.value
  )
    return refresh();
}, { immediate: true });

if (import.meta.client) {
  onBeforeUnmount(on(document, 'visibilitychange', () => {
    if (document.visibilityState === 'visible')
      refresh();
  }));
};

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
</script>

<template>
  <Transition name="fade">
    <div v-if="!folder" key="1">
      <!-- TODO: show skeleton -->
      loading ...
    </div>

    <div v-else-if="folderContents.length === 0" key="2">
      <!-- TODO: add styles -->
      No notes here yet ^_^
    </div>

    <TransitionGroup
      v-else
      key="3"
      tag="ul"
      name="list"
      class="contents__list"
      appear
      tabindex="-1"
      @contextmenu.prevent
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
