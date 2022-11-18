<script setup lang="ts">
import { withTrailingSlash } from 'ufo';

import type { Note } from '@prisma/client';
import type { FolderWithContents, NoteMinimal } from '~/composables/store';

interface Props { note: NoteMinimal; parent: FolderWithContents }
const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();
const notesCache = useNotesCache();

const newNoteName = ref('');

const isNoteActive = computed(() => decodeURIComponent(route.params.note as string) === props.note.name);

function showNote(note: NoteMinimal) {
  const encodedName = encodeURIComponent(note.name);
  router.push({ name: '@user-folders-note', params: { ...route.params, note: encodedName } });
}

function cancelActions() {
  if (props.note.creating)
    return deleteNoteFromFolder(props.note);

  newNoteName.value = '';

  updateNoteInFolder(props.note, { editing: false, creating: false });
}

async function createNewNote() {
  const folderPath = (Array.isArray(route.params.folders) ? route.params.folders.join('/') : route.params.folders) || '/';

  const newlyCreatedNote = await $fetch<Note>('/api/note', {
    method: 'POST',
    body: {
      name: newNoteName.value,
      parentId: props.parent.id,
      path: `${withTrailingSlash(folderPath)}${encodeURIComponent(newNoteName.value)}`,
    },
  });

  notesCache.set(newlyCreatedNote.id.toString(), newlyCreatedNote);
  updateNoteInFolder(props.note, { ...newlyCreatedNote, content: '', creating: false });

  showNote(newlyCreatedNote as NoteMinimal);
}

function handleEnter(e: KeyboardEvent) {
  if (props.note.creating) {
    e.preventDefault();
    createNewNote();
  }
}
</script>

<template>
  <div class="note" :class="{ 'note--active': isNoteActive }" v-bind="{ 'data-creating': note.creating, 'data-editing': note.editing }">
    <input
      v-if="note.creating || note.editing"
      v-model="newNoteName"
      class="note__input"
      @blur="cancelActions"
      @keypress.enter="handleEnter"
    >

    <button v-else class="note__name" @click="showNote(note)">
      {{ note.name }}
    </button>
  </div>
</template>

<style lang="scss">
.note {
  position: relative;
  z-index: 1;
  isolation: isolate;

  color: hsla(var(--text-color-hsl), 0.7);

  width: 100%;

  border-left: 1px solid hsla(var(--text-color-hsl), 0.15);

  transition: border-color .3s;

  &[data-creating="true"] {
    padding: 0.3rem 0.35rem;
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
    display: block;

    text-align: left;
    color: currentColor;

    height: 100%;
    width: 100%;

    padding: 0.5rem 0.35rem;

    appearance: none;
    border-radius: 0;
    border: none;
    background: transparent;

    cursor: pointer;

    transition: background-color .3s, color .3s;

    &:is(:hover, :focus-visible) {
      color: hsla(var(--text-color-hsl), 1);

      background-color: hsla(var(--text-color-hsl), 0.05);

      transition: background-color .1s, color .1s;
    }
  }

  &--active {
    color: var(--text-color);

    border-color: var(--text-color);
  }
}
</style>
