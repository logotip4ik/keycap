<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

import type { FolderOrNote, FolderWithContents } from '~/composables/store';

import { blankNoteName } from '~/assets/constants';

const router = useRouter();
const route = useRoute();
const user = useUser();
const currentFolder = useCurrentFolder();
const foldersCache = useFoldersCache();

const folderIdentifier = computed(() => `${route.params.folders.length}-${route.params.folders.at(-1)}`);

const { data: folder } = useLazyAsyncData<FolderWithContents>(
  () => {
    const folders = route.params.folders;
    const path = Array.isArray(folders) ? folders.at(-1) : folders as string;

    const folderPath = withLeadingSlash(route.params.user as string) + withLeadingSlash(path);
    const newCurrentFolder = foldersCache.get(withoutTrailingSlash(folderPath));

    if (newCurrentFolder) currentFolder.value = newCurrentFolder;
    else currentFolder.value = null;

    return $fetch(`/api/folder/${getApiFolderPath()}`);
  },
  { server: false, watch: [folderIdentifier] },
);

const mergedContents = computed(() => {
  if (!currentFolder.value) return [];

  return [...currentFolder.value.notes, ...currentFolder.value.subfolders] as FolderOrNote[];
});

function getApiFolderPath() {
  return Array.isArray(route.params.folders) ? route.params.folders.join('/') : '';
}

function goUpFolder() {
  const currentFolderPath = currentFolder.value!.path;
  const prevFolderPath = currentFolderPath.split('/').slice(2, -1);

  router.push({ name: '@user-folders-note', params: { folders: prevFolderPath, note: blankNoteName } });
}

function preCreateNoteOrFolder() {
  if (!currentFolder.value || !user.value) return;

  const id = BigInt(Math.floor(Math.random() * 1000));
  currentFolder.value.notes.unshift({ id, name: '', creating: true });

  nextTick(() => {
    (document.querySelector('.item[data-creating="true"] > input') as HTMLInputElement | null)?.focus();
  });
}

// updating if server sent different
watch(folder, (fetchedFolder) => {
  if (!fetchedFolder) return;

  fetchedFolder.notes = fetchedFolder.notes || [];
  fetchedFolder.subfolders = fetchedFolder.subfolders || [];

  foldersCache.set(fetchedFolder.path, fetchedFolder);

  currentFolder.value = fetchedFolder;
});

useTinykeys({
  '$mod+Shift+N': (event) => {
    event.preventDefault();

    preCreateNoteOrFolder();
  },
});
</script>

<template>
  <Transition name="contents-loading">
    <template v-if="currentFolder">
      <TransitionGroup tag="ul" name="list">
        <li v-if="!currentFolder.root" key="cd.." class="item">
          <button class="item__name" @click="goUpFolder">
            cd ..
          </button>
        </li>

        <li v-for="item in mergedContents" :key="item.id.toString()">
          <WorkspaceContentsItem :item="item" :parent="currentFolder" />
        </li>
      </TransitionGroup>
    </template>

    <template v-else>
      <PlaceholderContents />
    </template>
  </Transition>

  <button class="workspace__create-button" @click="preCreateNoteOrFolder">
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

    @media screen and (max-width: 740px) {
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
