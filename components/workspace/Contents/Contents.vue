<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

import type { ToastInstance } from '~/composables/toasts';

const route = useRoute();
const isOnline = useOnline();
const foldersCache = useFoldersCache();
const createToast = useToast();
const offlineStorage = useOfflineStorage();
const { shortcuts } = useAppConfig();

const folder = shallowRef<FolderWithContents | null | undefined>(
  foldersCache.get(withoutTrailingSlash(`/${route.params.user}/${getApiFolderPath()}`)),
);

const folderIdentifier = computed(() => {
  if (!route.params.folders) return '';

  // this accounts for empty string as well as empty array
  if (route.params.folders.length === 0) return '';

  return `${route.params.folders.length}-${route.params.folders.at(-1)}`;
});

const { data: fetchedFolder, error } = useLazyAsyncData<FolderWithContents>(
  'folder',
  () => {
    const folders = route.params.folders;
    const path = Array.isArray(folders) ? folders.at(-1) : folders as string;

    const folderPath = withLeadingSlash(route.params.user as string) + withLeadingSlash(path);
    const newCurrentFolder = foldersCache.get(withoutTrailingSlash(folderPath));

    if (newCurrentFolder) folder.value = newCurrentFolder;
    else folder.value = null;

    let loadingToast: undefined | ToastInstance;

    return $fetch(`/api/folder/${getApiFolderPath()}`, {
      retry: 2,
      onRequest: () => {
        loadingToast = createToast('Seems like your internet is slow 🤔', { duration: 999999, delay: 2250, type: 'loading' });
      },
      onResponse: () => {
        loadingToast?.remove();
      },
    });
  },
  { server: false, watch: [folderIdentifier] },
);

const mergedContents = computed(() => {
  if (!folder.value) return [];

  return [...folder.value.notes, ...folder.value.subfolders] as FolderOrNote[];
});

function getApiFolderPath() {
  return Array.isArray(route.params.folders) ? route.params.folders.join('/') : '';
}

async function goUpFolder() {
  const currentFolderPath = folder.value!.path;
  const prevFolderPath = withLeadingSlash(currentFolderPath.split('/').slice(1, -1).join('/'));

  if (isOnline || foldersCache.has(prevFolderPath))
    await navigateTo(generateItemRouteParams({ ...folder.value!, path: prevFolderPath }));
}

// TODO: fallback to previously saved content with help of localForage
watch(error, (_error) => {
  createToast('Error occurred while fetching folder contents');
});

// updating if server sent different
watch(fetchedFolder, (value) => {
  if (!value) return;

  value.notes = value.notes || [];
  value.subfolders = value.subfolders || [];

  foldersCache.set(value.path, toRaw(value));

  folder.value = value;

  offlineStorage?.value?.setItem(value.path, toRaw(value));
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
    <template v-if="folder">
      <TransitionGroup tag="ul" name="list">
        <li v-if="!folder.root" key="cd.." class="item">
          <button class="item__name" @click="goUpFolder">
            cd ..
          </button>
        </li>

        <li v-for="item in mergedContents" :key="item.id.toString()">
          <WorkspaceContentsItem :item="item" :parent="folder" />
        </li>
      </TransitionGroup>
    </template>

    <template v-else>
      <WorkspaceContentsSkeleton />
    </template>
  </Transition>

  <button class="workspace__create-button" @click="folder && preCreateItem(folder)">
    <Icon name="ic:outline-add" />
  </button>
</template>

<style lang="scss">
.workspace {
  &__create-button {
    --button-size-basis: 10vw;
    --button-size-max: 4rem;
    --button-size-min: 3.9rem;

    position: absolute;
    bottom: calc(var(--button-size-max) / 3);
    left: calc(var(--button-size-max) / 3);
    z-index: 1;

    height: var(--button-size-basis);
    width: var(--button-size-basis);

    max-width: var(--button-size-max);
    min-width: var(--button-size-min);
    max-height: var(--button-size-max);
    min-height: var(--button-size-min);

    appearance: none;

    border: none;
    border-radius: 50%;
    background: hsla(var(--text-color-hsl), .7);
    box-shadow: 0 0 1rem hsla(var(--text-color-hsl), .1);

    cursor: pointer;
    transition: background-color .3s;

    svg {
      color: hsla(var(--surface-color-hsl), 0.75);

      height: 50%;
      width: auto;

      transition: color .3s;
    }

    &:is(:hover, :focus-visible) {
      background-color: hsla(var(--text-color-hsl), 1);

      svg {
        color: hsla(var(--surface-color-hsl), 1);
      }
    }

    @media screen and (max-width: $breakpoint-tablet) {
      right: calc(var(--button-size-max) / 3);
      left: unset;
    }
  }
}
</style>
