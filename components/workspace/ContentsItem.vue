<script setup lang="ts">
import { withLeadingSlash, withTrailingSlash } from 'ufo';

import type { Note } from '@prisma/client';
import type { FolderOrNote, FolderWithContents, NoteMinimal, Updatable } from '~/composables/store';

import { blankNoteName } from '~/assets/constants';

interface Props { item: FolderOrNote; parent: FolderWithContents }
const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();
const user = useUser();
const notesCache = useNotesCache();
const foldersCache = useFoldersCache();

// TODO: add loading state
const newItemName = ref(props.item.name);

const isFolder = computed(() => 'root' in props.item);
const isItemActive = computed(() => decodeURIComponent(route.params.note as string) === props.item.name);

function generateItemRouteParams(item: FolderOrNote) {
  const isFolder = 'root' in item;

  if (isFolder) {
    const folders = [...(route.params.folders || []), item.name];

    return { name: '@user-folders-note', params: { folders, note: blankNoteName } };
  }
  else {
    return { name: '@user-folders-note', params: { ...route.params, note: (item as NoteMinimal).name } };
  }
}

function showItem(item: FolderOrNote) {
  const itemRouteParams = generateItemRouteParams(item);

  router.push(itemRouteParams);
}

function cancelActions() {
  if (props.item.creating)
    return deleteNoteFromFolder(props.item, props.parent);

  newItemName.value = props.item.name;

  updateNoteInFolder(props.item, { editing: false, creating: false }, props.parent);
}

async function createNote(folderPath: string) {
  const newNoteName = encodeURIComponent(newItemName.value);
  const newNotePath = withTrailingSlash(folderPath) + encodeURIComponent(decodeURIComponent(newNoteName));

  const newlyCreatedNote = await $fetch<Note>(`/api/note${withLeadingSlash(newNotePath)}`, {
    method: 'POST',
    body: { parentId: props.parent.id },
  });

  notesCache.set(newlyCreatedNote.id.toString(), newlyCreatedNote);
  updateNoteInFolder(props.item, { ...newlyCreatedNote, content: '', creating: false }, props.parent);

  showItem(newlyCreatedNote as FolderOrNote);
}

async function createFolder(folderPath: string) {
  const newFolderName = newItemName.value.substring(0, newItemName.value.length - 1);
  const newFolderPath = withTrailingSlash(folderPath) + encodeURIComponent(decodeURIComponent(newFolderName));

  const newlyCreatedFolder = await $fetch<FolderWithContents>(`/api/folder${withLeadingSlash(newFolderPath)}`, {
    method: 'POST',
    body: { name: newFolderName, parentId: props.parent.id },
  });

  newlyCreatedFolder.notes = newlyCreatedFolder.notes || [];
  newlyCreatedFolder.subfolders = newlyCreatedFolder.subfolders || [];

  foldersCache.set(newlyCreatedFolder.path, newlyCreatedFolder);

  deleteNoteFromFolder(props.item, props.parent);
  updateSubfolderInFolder(props.item, { ...newlyCreatedFolder, creating: false }, props.parent);
}

async function removeFolder() {
  const parentPath = (Array.isArray(route.params.folders) ? route.params.folders.join('/') : route.params.folders) || '/';
  const folderName = encodeURIComponent(decodeURIComponent(props.item.name));
  const folderPath = withLeadingSlash(withTrailingSlash(parentPath) + folderName);

  const response = await $fetch<{ status: 'ok' }>(`/api/folder${folderPath}`, { method: 'DELETE' });

  if (response.status !== 'ok') return;

  deleteSubfolderFromFolder(props.item, props.parent);

  notesCache.delete(props.item.path);
}

async function removeNote() {
  const parentPath = (Array.isArray(route.params.folders) ? route.params.folders.join('/') : route.params.folders) || '/';
  const noteName = encodeURIComponent(decodeURIComponent(props.item.name));
  const notePath = withTrailingSlash(parentPath) + noteName;

  const response = await $fetch<{ status: 'ok' }>(`/api/note${notePath}`, { method: 'DELETE' });

  if (response.status !== 'ok') return;

  showItem(props.parent);

  deleteNoteFromFolder(props.item, props.parent);

  notesCache.delete(props.item.path);
}

async function updateNote() {
  interface QuickResponse { status: 'ok' | 'error' }

  const newNote: Updatable<Note> = { name: newItemName.value.trim() };

  if (!newNote.name)
    return updateNoteInFolder(props.item, { editing: false }, props.parent);

  const parentPath = (Array.isArray(route.params.folders) ? route.params.folders.join('/') : route.params.folders) || '/';
  const noteName = encodeURIComponent(decodeURIComponent(props.item.name));
  const notePath = withTrailingSlash(parentPath) + noteName;

  const response = await $fetch<QuickResponse>(`/api/note${notePath}`, { method: 'PUT', body: newNote });

  if (response.status === 'error')
    return updateNoteInFolder(props.item, { editing: false }, props.parent);

  const newNotePath = withLeadingSlash(
    props.item.path.split('/').slice(0, -1).concat([encodeURIComponent(newNote.name)]).join('/'),
  );

  // @ts-expect-error undefined and null here are the same things
  notesCache.set(props.item.path, { ...props.item, name: newItemName.value.trim(), path: newNotePath });
  updateNoteInFolder(props.item, { editing: false, name: newItemName.value.trim(), path: newNotePath }, props.parent);

  router.replace(generateItemRouteParams({ ...props.item, name: newItemName.value.trim(), path: newNotePath }));
}

async function updateFolder() {

}

async function handleCreate() {
  const creatingPath = (Array.isArray(route.params.folders) ? route.params.folders.join('/') : route.params.folders) || '/';
  const isCreatingFolder = newItemName.value.at(-1) === '/';

  if (isCreatingFolder) createFolder(creatingPath);
  else createNote(creatingPath);
}

async function handleRemove() {
  if (isFolder.value)
    return removeFolder();
  else
    return removeNote();
}

async function handleUpdate() {
  if (isFolder.value) updateFolder();
  else updateNote();
}

function handleEnter(e: KeyboardEvent) {
  if (props.item.creating) {
    e.preventDefault();
    handleCreate();
  }

  if (props.item.editing)
    handleUpdate();
}

function handleContextmenu() {
  if (isFolder.value)
    updateSubfolderInFolder(props.item, { editing: true }, props.parent);

  else
    updateNoteInFolder(props.item, { editing: true }, props.parent);

  nextTick(() => {
    (document.querySelector('.item[data-editing="true"] > input') as HTMLInputElement | null)?.focus();
  });
}
</script>

<template>
  <div
    class="item"
    :class="{ 'item--active': isItemActive }"
    v-bind="{ 'data-creating': item.creating, 'data-editing': item.editing }"
  >
    <input
      v-if="item.creating || item.editing"
      v-model="newItemName"
      class="item__input"
      @blur="cancelActions"
      @keypress.enter="handleEnter"
    >

    <template v-else>
      <NuxtLink
        class="item__name"
        :to="generateItemRouteParams(item)"
        @contextmenu.prevent="handleContextmenu"
      >
        <template v-if="isFolder">
          <Icon name="ic:outline-folder" class="item__name__folder-icon" />
        </template>

        <span class="item__name__text">{{ decodeURIComponent(item.name) }}</span>
      </NuxtLink>

      <button class="item__edit" @click="handleContextmenu">
        <Icon name="ic:baseline-more-vert" class="item__delete__icon" />
      </button>

      <button class="item__delete" @click="handleRemove">
        <Icon name="ic:baseline-delete-outline" class="item__delete__icon" />
      </button>
    </template>
  </div>
</template>

<style lang="scss">
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;;

  position: relative;
  z-index: 1;
  isolation: isolate;

  color: hsla(var(--text-color-hsl), 0.7);

  width: 100%;

  border-left: 0.2rem solid hsla(var(--text-color-hsl), 0);

  transition: border-color .3s, background-color .3s, color .3s;

  &[data-creating="true"],
  &[data-editing="true"] {
    padding: 0.3rem 0.1rem;
  }

  &__input {
    font: inherit;
    line-height: 1.75;
    color: currentColor;

    width: 100%;

    padding: 0 0.25rem;

    border-radius: 0.5rem;
    border: 1px solid hsla(var(--text-color-hsl), 0.25);
    background-color: transparent;

    appearance: none;

    &:is(:hover, :focus-visible) {
      outline: none;
      border: 1px solid hsla(var(--text-color-hsl), 0.75);
    }
  }

  &__name {
    align-self: stretch;

    display: flex;
    align-items: center;

    text-align: left;
    text-decoration: none;
    color: currentColor;

    width: 100%;
    min-height: 100%;

    padding: 0.5rem 0.35rem;

    appearance: none;
    border-radius: 0;
    border: none;
    background: transparent;

    cursor: pointer;
    overflow: hidden;

    &__folder-icon {
      margin-right: 0.25rem;
    }

    &__text {
      white-space: nowrap;
      text-overflow: ellipsis;

      overflow: hidden;
    }
  }

  &__delete,
  &__edit {
    --button-size-basis: 3vw;
    --button-size-max: 2rem;
    --button-size-min: 1.9rem;

    color: hsla(var(--text-color-hsl), 0.1);

    width: var(--button-size-basis);
    height: var(--button-size-basis);

    max-width: var(--button-size-max);
    min-width: var(--button-size-min);
    max-height: var(--button-size-max);
    min-height: var(--button-size-min);

    margin-block: 0.25rem;
    margin-inline-end: 0.25rem;

    appearance: none;
    border: none;
    border-radius: 0.2rem;
    background-color: transparent;

    cursor: pointer;
    transition: color .3s, background-color .3s;

    &__icon {
      height: 70%;
      width: auto;
    }

    &:is(:hover, :focus-visible) {
      color: #f05545;

      background-color: hsla(var(--text-color-hsl), 0.1);

      transition: color .1s, background-color .1s;
    }
  }

  &__edit {
    display: none;

    &:is(:hover, :focus-visible) {
      color: var(--text-color);
    }

    @media screen and (max-width: 740px) {
      display: block;
    }
  }

  &:is(:hover, :focus-visible) {
    color: hsla(var(--text-color-hsl), 1);

    border-color: hsla(var(--text-color-hsl), 0.05);

    background-color: hsla(var(--text-color-hsl), 0.05);

    transition: background-color .1s, color .1s;
  }

  &--active {
    color: var(--text-color);

    border-color: var(--text-color) !important;
  }
}
</style>
