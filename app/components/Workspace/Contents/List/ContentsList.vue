<script setup lang="ts">
import { useContentsState } from '../config';

const route = useRoute();
const isFallbackMode = useFallbackMode();
const detailsItem = useCurrentItemForDetails();
const foldersCache = useFoldersCache();
const offlineStorage = getOfflineStorage();
const createToast = useToaster();
const user = useRequiredUser();
const fuzzyWorker = getFuzzyWorker();
const { shortcuts } = useAppConfig();
const { state: contentsState } = useContentsState();

const mitt = useMitt();
const zeenk = useZeenk();

const folderApiPath = computed(() => {
  return isArray(route.params.folders) && route.params.folders.length > 0
    ? `/${route.params.folders.map(encodeURIComponent).join('/')}`
    : '';
});
const folderPath = computed(() => `/${user.value.username}${folderApiPath.value}`);
const shouldSkipFetching = computed(() => contentsState.value === 'hidden');

const menuOptions = shallowReactive({
  item: undefined as FolderMinimal | NoteMinimal | undefined,
  target: undefined as HTMLElement | undefined,
});

const { data: folder, refresh } = useKFetch<FolderWithContents>(() => `/api/folder${folderApiPath.value}`, {
  deep: true,
  skip: shouldSkipFetching,
  watch: [folderApiPath, contentsState],
  pollingTime: parseDuration('2.5 minutes')!,
  getCached: ({ inErrorBlock }) => {
    const cached = foldersCache.get(folderPath.value);

    if (cached) {
      return cached;
    }

    return offlineStorage.getItem(folderPath.value)
      .then(async (offlineCopy) => {
        if (inErrorBlock && !offlineCopy) {
          createToast(
            `Sorry ⊙︿⊙ We couldn't find offline copy for folder: "${route.params.folders.at(-1)}".`,
          );

          await navigateTo(`/@${user.value.username}`);

          return;
        }

        return offlineCopy as FolderWithContents;
      });
  },
  onResponse: (fetchedFolder) => {
    foldersCache.set(fetchedFolder.path, fetchedFolder);
    offlineStorage.setItem(fetchedFolder.path, fetchedFolder);

    const creatingItem = folder.value?.notes.find((item) => item.state === ItemState.Creating);

    if (creatingItem) {
      preCreateItem(fetchedFolder, creatingItem);
    }
  },
  getSuccessToast: () => createToast('Succeeded fetching folder. Showing fresh one.'),
  getErrorToast: () => createToast('Failed to fetch current folder, showing cached one.'),
});

const folderContents = computed(() => {
  if (!folder.value) {
    return [];
  }

  const notes = folder.value.notes || [];
  const subfolders = folder.value.subfolders || [];

  return notes.concat(subfolders) as Array<FolderMinimal | NoteMinimal>;
});

function showMenu(target: HTMLElement, item: FolderMinimal | NoteMinimal) {
  if (isFallbackMode.value) {
    return;
  }

  menuOptions.item = item;
  menuOptions.target = target;
}

function handleCreateItem(initialValues?: Parameters<typeof preCreateItem>[1]) {
  // this will also trigger folder fetching if needed
  if (contentsState.value === 'hidden') {
    contentsState.value = 'visible';
  }

  if (!folder.value) {
    const stop = watchEffect(() => {
      if (folder.value) {
        preCreateItem(folder.value, initialValues);
        stop();
      }
    });
  }
  else {
    preCreateItem(folder.value, initialValues);
  }
}

function refetchFolderIfNeeded(path: string) {
  if (folder.value && path.startsWith(folder.value.path)) {
    refresh();
  }
}

mitt.on('precreate:item', (event) => handleCreateItem(event));
mitt.on('refresh:folder', () => {
  const refreshToast = createToast('Refreshing folder...', {
    type: 'loading',
    delay: parseDuration('0.3s')!,
  });

  refresh().finally(refreshToast.remove);
});
mitt.on('details:show:folder', () => {
  if (!folder.value) {
    const stop = watch(folder, (folder) => {
      if (folder) {
        detailsItem.value = folder;
        stop();
      }
    });

    refresh();
  }
  else {
    detailsItem.value = folder.value;
  }
});

zeenk.on('item-created', ({ path }) => {
  fuzzyWorker.value
    ?.refreshItemsCache()
    .then(validateOfflineStorage);

  refetchFolderIfNeeded(path);
});

zeenk.on('item-renamed', async ({ path, oldPath }) => {
  fuzzyWorker.value
    ?.refreshItemsCache()
    .then(validateOfflineStorage);

  const renamedFolder = foldersCache.has(oldPath);
  const currentItemPath = route.path.replace('/@', '/');

  if (currentItemPath === oldPath) {
    await navigateTo(path.replace('/', '/@'));
    refetchFolderIfNeeded(path);
  }
  else if (renamedFolder && folderPath.value.startsWith(oldPath)) {
    await navigateTo(
      currentItemPath
        .replace(oldPath, path)
        .replace('/', '/@'),
    );
  }
  else {
    refetchFolderIfNeeded(path);
  }
});

zeenk.on('item-deleted', async ({ path }) => {
  fuzzyWorker.value
    ?.refreshItemsCache()
    .then(validateOfflineStorage);

  const deletedFolder = foldersCache.has(path);

  const lastSlashIdx = path.lastIndexOf('/');
  const newPath = `/@${path.substring(1, lastSlashIdx)}/${BLANK_NOTE_NAME}`;

  if (
    (deletedFolder && folderPath.value.startsWith(path))
    || route.path.replace('/@', '/') === path
  ) {
    await navigateTo(newPath);
  }
  else {
    refetchFolderIfNeeded(path);
  }
});

useTinykeys({
  [shortcuts.new]: async (event) => {
    const alreadyCreating = folder.value
      && folder.value.notes.some((note) => note.state === ItemState.Creating);

    if (alreadyCreating) {
      return;
    }

    event.preventDefault();

    handleCreateItem();
  },
});
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
      handle-arrows-press="vertical"
      @contextmenu.self.prevent
      @click.self="menuOptions.target = undefined"
    >
      <WithFadeTransition v-for="item in folderContents" :key="item.id + item.path">
        <li
          v-if="item.state"
          key="1"
          class="contents__list__item"
        >
          <Suspense>
            <LazyWorkspaceContentsListItemInput
              :item="item"
              :parent="folder"
            />

            <template #fallback>
              <WorkspaceContentsListItemFallback />
            </template>
          </Suspense>
        </li>

        <li
          v-else
          key="2"
          class="contents__list__item"
        >
          <Suspense>
            <LazyWorkspaceContentsListItem
              :item="item"
              :parent="folder"
              :menu-target="menuOptions.target"
              @show-menu="showMenu($event, item)"
            />

            <template #fallback>
              <WorkspaceContentsListItemFallback />
            </template>
          </Suspense>
        </li>
      </WithFadeTransition>
    </WithListTransitionGroup>
  </WithFadeTransition>

  <LazyWorkspaceContentsListMenu
    v-if="menuOptions.item && menuOptions.target && folder"
    :item="menuOptions.item"
    :target="menuOptions.target"
    :parent="folder"
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
  scroll-snap-type: y mandatory; // proximity behaves really weirdly in chrome

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
