<script setup lang="ts">
import { isProduction } from 'std-env';
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

import type { RefToastInstance } from '~/composables/toasts';

const route = useRoute();
const isFallbackMode = useFallbackMode();
const foldersCache = useFoldersCache();
const createToast = useToast();
const offlineStorage = useOfflineStorage();
const { shortcuts } = useAppConfig();
const { showLoading, hideLoading } = useLoadingIndicator();
const mitt = useMitt();
const user = useUser();

const folderPath = computed(() => {
  const folders = (Array.isArray(route.params.folders) ? route.params.folders : [route.params.folders])
    .filter((str) => !!str);

  return withoutTrailingSlash(`/${route.params.user}/${folders.join('/')}`);
});

const folder = ref<FolderWithContents | null>(
  foldersCache.get(folderPath.value) || null,
);

const POLLING_TIME = (isProduction ? 30 : 10) * 1000;
let pollingTimer: NodeJS.Timeout;
let firstTimeFetch = true;
let prevFolderPath = folderPath.value;
let loadingToast: RefToastInstance;

const { data: fetchedFolder, error, refresh } = useLazyAsyncData<FolderWithContents>(
  'folder',
  () => {
    clearTimeout(pollingTimer);

    folder.value = foldersCache.get(folderPath.value) || null;

    if (!folder.value) {
      offlineStorage.value?.getItem(folderPath.value)
        .then((folderCopy) => folderCopy && (folder.value = folderCopy));
    }

    const apiFolderPath = folderPath.value.split('/').slice(2).join('/');

    return $fetch(`/api/folder/${apiFolderPath}`, {
      retry: 2,
      onRequest: () => {
        showLoading();

        if (prevFolderPath !== folderPath.value)
          firstTimeFetch = true;

        if (!loadingToast?.value) {
          loadingToast = createToast('Fetching folder contents. Please wait...', {
            duration: 60 * 1000,
            delay: firstTimeFetch ? 3000 : 0,
            type: 'loading',
          });

          firstTimeFetch = false;
        }

        prevFolderPath = folderPath.value;
      },
      onResponse: (ctx) => {
        if (ctx.response.ok || ctx.error) {
          hideLoading();

          loadingToast.value?.remove();

          pollingTimer = setTimeout(refresh, POLLING_TIME);
        }
      },
    });
  },
  { server: false, watch: [folderPath] },
);

const mergedContents = computed(() => {
  if (!folder.value) return [];

  return [...folder.value.notes, ...folder.value.subfolders] as FolderOrNote[];
});

async function goUpFolder() {
  const currentFolderPath = folder.value!.path;
  const prevFolderPath = withLeadingSlash(currentFolderPath.split('/').slice(1, -1).join('/'));

  if (!isFallbackMode.value || foldersCache.has(prevFolderPath))
    await navigateTo(generateItemRouteParams({ ...folder.value!, path: prevFolderPath }));
}

mitt.on('cache:populated', () => {
  folder.value = foldersCache.get(folderPath.value) || null;
});

// TODO:Create wrapper function for fetch that will handle showing loading and error toast
watch(error, async (error) => {
  // if there was previously error, reset the fallback mode to false
  if (!error)
    return isFallbackMode.value = false;

  loadingToast.value?.remove();

  // @ts-expect-error there actually is statusCode
  if (error.statusCode && error.statusCode === 401) {
    user.value = null;
    await navigateTo('/login');
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

  if (!offlineFolder)
    return createToast('No offline copy found');

  folder.value = offlineFolder;
});

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
        <button class="item" @click="goUpFolder">
          <span class="item__name">cd ..</span>
        </button>
      </li>

      <li v-for="item in mergedContents" :key="item.id.toString()">
        <WorkspaceContentsItem :item="item" :parent="folder" />
      </li>
    </TransitionGroup>

    <WorkspaceContentsSkeleton v-else />
  </Transition>
</template>
