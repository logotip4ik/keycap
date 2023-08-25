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

const folderApiPath = computed(() => {
  return Array.isArray(route.params.folders) && route.params.folders.length > 0
    ? `/${route.params.folders.map(encodeURIComponent).join('/')}`
    : '';
});

const visibleStates = ['visible', 'pinned'] satisfies Array<SidebarState>;
const POLLING_TIME = parseDuration('2.5 minutes')!;
let pollingTimer: NodeJS.Timeout;

// Intentionally not awaited
const { data: folder, refresh } = useAsyncData<FolderWithContents | undefined>('folder', async () => {
  if (import.meta.env.SSR || props.state === 'hidden') return;

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

const parentFolderPath = computed(() => {
  if (!folder.value) return '#';

  const parentPath = folder.value.path
    .split('/')
    .filter(Boolean);

  parentPath.pop();

  return `/@${parentPath.join('/')}`;
});

watch(() => props.state, (state, oldState) => {
  if (
    visibleStates.includes(state)
    && (!oldState || oldState === 'hidden')
    && !folder.value
  )
    return refresh();
}, { immediate: true });
</script>

<template>
  <Transition appear name="fade">
    <div v-if="!folder" key="1">
      <!-- TODO: show skeleton -->
      loading ...
    </div>

    <div v-else-if="folderContents.length === 0" key="2">
      No notes here yet ^_^
    </div>

    <TransitionGroup v-else key="3" tag="ul" name="list" style="overflow: auto;">
      <li
        v-for="item in folderContents"
        :key="item.id"
      >
        <NuxtLink :href="generateItemRouteParams(item)">
          {{ item.name }}
        </NuxtLink>
      </li>
    </TransitionGroup>
  </Transition>
</template>
