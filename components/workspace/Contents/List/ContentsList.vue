<script setup lang="ts">
import parseDuration from 'parse-duration';

import type { SidebarState } from '~/composables/sidebars';

const props = defineProps<{
  state: SidebarState
  onUpdateState: (newState: SidebarState) => any
}>();

const route = useRoute();
const isFallbackMode = useFallbackMode();
const foldersCache = useFoldersCache();
const offlineStorage = useOfflineStorage();
const createToast = useToaster();
const mitt = useMitt();
const user = useUser();
const { shortcuts } = useAppConfig();

const folderApiPath = computed(() => {
  return Array.isArray(route.params.folders) && route.params.folders.length > 0
    ? `/${route.params.folders.map(encodeURIComponent).join('/')}`
    : '';
});

const itemComponentResolved = ref(false);
const menuOptions = shallowReactive({
  item: null as FolderOrNote | null,
  target: null as HTMLElement | null,
});

const POLLING_TIME = parseDuration('2.5 minutes')!;
let pollingTimer: NodeJS.Timeout;
let abortControllerGet: AbortController | null;
let lastRefetch: number | undefined;

const { data: folder, refresh } = await useAsyncData<FolderWithContents | undefined>('folder', async () => {
  clearTimeout(pollingTimer);

  abortControllerGet?.abort();
  abortControllerGet = new AbortController();

  lastRefetch = Date.now();

  $fetch(`/api/folder${folderApiPath.value}`, { signal: abortControllerGet.signal })
    .then((res) => {
      if (!res) return;

      const { data: fetchedFolder } = res;
      isFallbackMode.value = false;

      folder.value = fetchedFolder;
      foldersCache.set(fetchedFolder.path, fetchedFolder);
      offlineStorage.setItem?.(fetchedFolder.path, fetchedFolder);
    })
    .catch(handleError)
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
  deep: true, // TODO: make it work with `deep: false`
  watch: [folderApiPath],
});

const folderContents = computed(() => {
  if (!folder.value) return [];

  const notes = folder.value.notes || [];
  const subfolders = folder.value.subfolders || [];

  return notes.concat(subfolders) as Array<FolderOrNote>;
});

function showMenu(target: HTMLElement, item: FolderOrNote) {
  if (isFallbackMode.value) return;

  menuOptions.item = item;
  menuOptions.target = target;
}

async function handleError(error: Error) {
  if (error.message.includes('aborted'))
    return;

  // @ts-expect-error there actually is statusCode
  if (error.statusCode === 401 || !user.value) {
    user.value = null;
    await navigateTo('/login');
    return;
  }
  // @ts-expect-error there actually is statusCode
  if (error.statusCode === 404)
    return await navigateTo(`/@${user.value.username}`);

  // Other network error ?
  if (error.name === 'FetchError') {
    sendError(error); // Try to send the error
    isFallbackMode.value = true;
  }

  // But if folder was found in cache, then do nothing, just display it
  if (folder.value)
    return;

  // last chance to show user folder, if iterator in @[user].vue page hasn't yet set the foldersCache
  const folderPath = `/${route.params.user}${folderApiPath.value}`;
  const offlineFolder = await offlineStorage.getItem?.(folderPath);

  if (!offlineFolder) {
    createToast(`Sorry ⊙︿⊙ We couldn't find offline copy for folder: "${route.params.folders.at(-1)}"`);

    await navigateTo(`/@${user.value.username}`);

    return;
  }

  folder.value = offlineFolder;
}

watch(() => props.state, (state, oldState) => {
  if (
    state !== 'hidden'
    && (!oldState || oldState === 'hidden')
    && !folder.value
  )
    return refresh();
}, { immediate: import.meta.client });

mitt.on('cache:populated', () => {
  const folderPath = `/${route.params.user}${folderApiPath.value}`;

  folder.value = foldersCache.get(folderPath) || null;
});

// TODO: rework details trigger ?
// mitt.on('details:show', () => {
//   // const noNote = !route.params.note || route.params.note === BLANK_NOTE_NAME;

//   // if (folder.value && noNote)
//   // detailsItem.value = { };
// });

useTinykeys({
  [shortcuts.new]: async (event) => {
    event.preventDefault();

    if (props.state === 'hidden') {
      props.onUpdateState('visible');

      await nextTick();
    }

    const alreadyCreating = folder.value && folder.value.notes.some((note) => note.creating);

    if (alreadyCreating)
      return;

    if (folder.value) {
      preCreateItem(folder.value);
    }
    else if (!folder.value) {
      const stop = watch(() => [folder.value, itemComponentResolved.value], () => {
        if (!folder.value)
          return;

        const isEmptyFolder = folder.value.notes.length === 0 && folder.value.subfolders.length === 0;

        if (isEmptyFolder || itemComponentResolved.value) {
          stop();
          setTimeout(() => preCreateItem(folder.value!), 100);
        }
      });
    }
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

if (import.meta.client) {
  const offVisibilityChange = on(document, 'visibilitychange', () => {
    const timeDiff = Date.now() - (lastRefetch || 0);

    if (
      document.visibilityState === 'visible'
      && props.state !== 'hidden'
      && timeDiff > parseDuration('15 seconds')!
    )
      refresh();
  });

  onBeforeUnmount(() => {
    offVisibilityChange();
    abortControllerGet?.abort();
  });
};
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
      <template v-for="item in folderContents" :key="item.id">
        <Transition name="fade">
          <li
            v-if="item.creating || item.editing"
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
            <Suspense @resolve="itemComponentResolved = true">
              <LazyWorkspaceContentsListItem
                :item="item"
                :parent="folder"
                :menu-target="menuOptions.target"
                @show-menu="showMenu($event, item)"
                @should-hide-sidebar="onUpdateState('hidden')"
              />
            </Suspense>
          </li>
        </Transition>
      </template>
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
