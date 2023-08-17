<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';
import parseDuration from 'parse-duration';

import type { RefToastInstance } from '~/composables/toasts';

const route = useRoute();
const isFallbackMode = useFallbackMode();
const foldersCache = useFoldersCache();
const createToast = useToast();
const offlineStorage = useOfflineStorage();
const currentItemForDetails = useCurrentItemForDetails();
const { shortcuts } = useAppConfig();
const mitt = useMitt();
const user = useUser();

const folderPath = computed(() => {
  const folders = (Array.isArray(route.params.folders) ? route.params.folders : [route.params.folders])
    .filter((str) => !!str)
    .map(encodeURIComponent);

  return withoutTrailingSlash(`/${route.params.user}/${folders.join('/')}`);
});

const folder = ref<FolderWithContents | null>(
  foldersCache.get(folderPath.value) || null,
);

const POLLING_TIME = parseDuration('2.5 minutes')!;
let pollingTimer: NodeJS.Timeout;
let firstTimeFetch = true;
let prevFolderPath = folderPath.value;
let loadingToast: RefToastInstance;

const { data: fetchedFolder, error, refresh } = await useLazyAsyncData<FolderWithContents>(
  'folder',
  async () => {
    clearTimeout(pollingTimer);

    folder.value = foldersCache.get(folderPath.value) || null;

    if (!folder.value) {
      offlineStorage.value?.getItem(folderPath.value)
        .then((folderCopy) => folderCopy && (folder.value = folderCopy));
    }

    const apiFolderPath = folderPath.value.split('/').slice(2).join('/');

    if (prevFolderPath !== folderPath.value)
      firstTimeFetch = true;

    if (!loadingToast?.value) {
      loadingToast = createToast('Fetching folder contents. Please wait...', {
        duration: parseDuration('1 minute'),
        delay: firstTimeFetch ? 3000 : 250,
        type: 'loading',
      });

      firstTimeFetch = false;
    }

    prevFolderPath = folderPath.value;

    return await $fetch<FolderWithContents>(
      `/api/folder/${apiFolderPath}`,
      { retry: 2 },
    )
      .finally(() => {
        loadingToast.value?.remove();

        const multiplier = document.visibilityState === 'visible' ? 1 : 2;
        pollingTimer = setTimeout(refresh, POLLING_TIME * multiplier);
      });
  },
  { server: false, watch: [folderPath] },
);

const mergedContents = computed(() => {
  if (!folder.value) return [];

  return folder.value.notes.concat(folder.value.subfolders) as Array<FolderOrNote>;
});

const parentFolderPath = computed(() => {
  const currentFolderPath = folder.value!.path;
  const prevFolderPath = withLeadingSlash(currentFolderPath.split('/').slice(1, -1).join('/'));

  if (isFallbackMode.value && !foldersCache.has(prevFolderPath))
    return { path: window.location.pathname };

  return generateItemRouteParams({ ...folder.value, path: prevFolderPath });
});

mitt.on('cache:populated', () => {
  folder.value = foldersCache.get(folderPath.value) || null;
});

mitt.on('details:show', () => {
  const noNote = !route.params.note || route.params.note === BLANK_NOTE_NAME;

  if (folder.value && noNote)
    currentItemForDetails.value = folder.value;
});

// TODO:Create wrapper function for fetch that will handle showing loading and error toast
watch(error, debounce(async (error: Error | null) => {
  // if there was previously error, reset the fallback mode to false
  if (!error)
    return isFallbackMode.value = false;

  // @ts-expect-error there actually is statusCode
  if (error.statusCode === 401 || !user.value) {
    user.value = null;
    await navigateTo('/login');
    return;
  }
  // @ts-expect-error there actually is statusCode
  if (error.statusCode === 404) {
    await navigateTo(`/@${user.value.username}`);
    return;
  }

  // No network connection
  if (error.name === 'FetchError')
    isFallbackMode.value = true;

  // But if folder was found in cache, then do nothing, just display it
  if (folder.value)
    return;

  // last chance to show user folder, if iterator in @[user].vue page hasn't yet set the foldersCache
  const offlineFolder = await offlineStorage.value?.getItem(folderPath.value) as FolderWithContents;

  if (!offlineFolder) {
    createToast(`Sorry ⊙︿⊙ We can't find offline copy for folder: "${route.params.folders.at(-1)}"`);

    await navigateTo(`/@${user.value.username}`);

    return;
  }

  folder.value = offlineFolder;
}));

// updating if server sent different
watch(fetchedFolder, (value) => {
  if (!value) return;

  value.notes = value.notes || [];
  value.subfolders = value.subfolders || [];

  folder.value = toRaw(value);
  foldersCache.set(value.path, toRaw(value));

  isFallbackMode.value = false;
  offlineStorage.value?.setItem(value.path, toRaw(value));
});

useTinykeys({
  [shortcuts.new]: (event) => {
    event.preventDefault();

    if (folder.value) preCreateItem(folder.value);
  },
});
</script>

<template>
  <Transition name="fade">
    <TransitionGroup v-if="folder" :key="folder.path" tag="ul" name="list" class="workspace__contents__list">
      <li v-if="!folder.root" key="1">
        <NuxtLink class="item" :href="parentFolderPath">
          <span class="item__name">cd ..</span>
        </NuxtLink>
      </li>

      <template v-if="mergedContents.length > 0">
        <li v-for="item in mergedContents" :key="item.id.toString()">
          <WorkspaceContentsItem :item="item" :parent="folder" />
        </li>
      </template>

      <template v-else-if="folder.root && mergedContents.length === 0">
        <li class="item item--empty">
          <p class="item__name">
            <span>Start by clicking</span>

            &nbsp;

            <kbd>
              <LazyIconBaselineMoreVert width="1rem" />
            </kbd>
          </p>
        </li>
      </template>
    </TransitionGroup>

    <WorkspaceContentsSkeleton v-else />
  </Transition>
</template>

<style lang="scss">
.item {
  &--empty {
    pointer-events: none;

    .item__name {
      margin: 0;

      @media screen and (max-width: $breakpoint-tablet) {
        justify-content: center;
      }
    }

    kbd {
      margin-left: 0.5rem;
      padding-left: 0.35rem;
      padding-right: 0.35rem;
    }
  }
}
</style>
