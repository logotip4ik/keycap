<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

import { blankNoteName } from '~/assets/constants';

const route = useRoute();
const foldersCache = useFoldersCache();
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

const { data: fetchedFolder } = useLazyAsyncData<FolderWithContents>(
  'folder',
  () => {
    const folders = route.params.folders;
    const path = Array.isArray(folders) ? folders.at(-1) : folders as string;

    const folderPath = withLeadingSlash(route.params.user as string) + withLeadingSlash(path);
    const newCurrentFolder = foldersCache.get(withoutTrailingSlash(folderPath));

    if (newCurrentFolder) folder.value = newCurrentFolder;
    else folder.value = null;

    return $fetch(`/api/folder/${getApiFolderPath()}`);
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
  const prevFolderPath = currentFolderPath.split('/').slice(2, -1);

  await navigateTo({ name: '@user-folders-note', params: { folders: prevFolderPath, note: blankNoteName } });
}

// updating if server sent different
watch(fetchedFolder, (value) => {
  if (!value) return;

  value.notes = value.notes || [];
  value.subfolders = value.subfolders || [];

  foldersCache.set(value.path, toRaw(value));

  folder.value = value;
});

useTinykeys({
  [shortcuts.new]: (event) => {
    event.preventDefault();

    if (folder.value) preCreateItem(folder.value);
  },
});
</script>

<template>
  <Transition name="contents-loading">
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
      <PlaceholderContents />
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

$list-transition-duration: 0.25s;
$fade-transition-duration: 0.25s;

.contents-loading-enter-active,
.contents-loading-leave-active {
  transition: opacity $fade-transition-duration * 2;
}

.contents-loading-enter-active.skeleton {
  transition-delay: $fade-transition-duration;
}

.contents-loading-enter-from,
.contents-loading-leave-to {
  opacity: 0;
}

.contents-loading-leave-active {
  display: none;
}

.list-enter-active,
.list-leave-active {
  transition: all $list-transition-duration * 2 ease;
}

.list-move {
  transition-duration: $list-transition-duration;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  display: none;
}
</style>
