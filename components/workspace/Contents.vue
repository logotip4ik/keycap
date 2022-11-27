<script setup lang="ts">
import { withLeadingSlash } from 'ufo';

import type { FolderOrNote, FolderWithContents } from '~/composables/store';

import { blankNoteName } from '~/assets/constants';

const router = useRouter();
const route = useRoute();
const user = useUser();
const currentFolder = useCurrentFolder();
const foldersCache = useFoldersCache();

const folderApiPath = computed(() => Array.isArray(route.params.folders) ? route.params.folders.join('/') : '');

const { data: folder, pending } = useLazyAsyncData<FolderWithContents>(
  () => $fetch(`/api/folder/${getApiFolderPath()}`),
  { server: false, watch: [() => route.params.folders] },
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

// setting initial folder
watch(folderApiPath, (path) => {
  const folderPath = withLeadingSlash(route.params.user as string) + withLeadingSlash(path);
  const newCurrentFolder = foldersCache.get(folderPath);

  if (newCurrentFolder) currentFolder.value = newCurrentFolder;
}, { immediate: true });

// updating if server sent different
watch(folder, (fetchedFolder) => {
  if (!fetchedFolder) return;

  fetchedFolder.notes = fetchedFolder.notes || [];
  fetchedFolder.subfolders = fetchedFolder.subfolders || [];

  foldersCache.set(fetchedFolder.path, fetchedFolder);

  currentFolder.value = fetchedFolder;
});
</script>

<template>
  <template v-if="!currentFolder && pending">
    <div>
      Loading folder contents...
    </div>
  </template>
  <template v-else-if="currentFolder">
    <TransitionGroup tag="ul" name="list">
      <li v-if="!currentFolder.root" key="cd.." class="item">
        <button class="item__name" @click="goUpFolder">
          cd ..
        </button>
      </li>

      <template v-for="item in mergedContents" :key="item.id.toString()">
        <li>
          <WorkspaceContentsItem :item="item" :parent="currentFolder" />
        </li>
      </template>
    </TransitionGroup>
  </template>

  <button class="workspace__create-button" @click="preCreateNoteOrFolder">
    <Icon name="ic:outline-add" />
  </button>
</template>

<style lang="scss">
.workspace {
  &__create-button {
    --button-size-basis: 10vw;
    --button-size-max: 4rem;

    position: absolute;
    bottom: calc(var(--button-size-max) / 3);
    left: calc(var(--button-size-max) / 3);
    z-index: 1;

    height: var(--button-size-basis);
    width: var(--button-size-basis);

    max-width: var(--button-size-max);
    max-height: var(--button-size-max);

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
  }
}

$list-transition-duration: 0.3s;

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
