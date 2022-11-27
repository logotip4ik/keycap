<script setup lang="ts">
import { withLeadingSlash } from 'ufo';

import type { Note } from '@prisma/client';
import type { Updatable } from '~/composables/store';

const route = useRoute();
const isOnline = useOnline();
const notesCache = useNotesCache();

const note = ref<Note | null | undefined>(notesCache.get(`/${route.params.user}${getUniqueNoteKey()}`));

const { data: fetchNote, pending } = useLazyFetch<Note>(() => `/api/note${getUniqueNoteKey()}`, {
  server: false,
});

const throttledUpdate = useThrottleFn(updateNote, 1000);
function updateNote(content: string) {
  if (!note.value) return;

  if (note.value.content === content) return;

  interface QuickResponse { status: 'ok' | 'error' }

  const newNote: Updatable<Note> = { content };

  const updatePath = `/api/note${getUniqueNoteKey()}`;

  if (isOnline.value) notesCache.set(note.value.path, { ...note.value, ...newNote });

  $fetch(updatePath, { method: 'PUT', body: newNote })
    .then((response) => {
      if ((response as QuickResponse).status === 'error' || !note.value) return;

      notesCache.set(note.value.path, { ...note.value, ...newNote });
    });
}

function getUniqueNoteKey() {
  const paths = Array.isArray(route.params.folders)
    ? [route.params.folders, route.params.note]
    : [route.params.note];

  return withLeadingSlash(paths.join('/'));
}

watch(fetchNote, (value) => {
  if (!value) return;

  note.value = value;
  notesCache.set(value.path, value);
});
</script>

<template>
  <Transition name="note-loading" mode="out-in">
    <div v-if="pending && !note">
      loading placeholder
    </div>

    <div v-else-if="note">
      <ClientOnly class="workspace__note-editor__wrapper">
        <WorkspaceNoteEditor class="workspace__note-editor" :content="note.content || ''" @update="throttledUpdate" />
      </ClientOnly>
    </div>
  </Transition>
</template>

<style lang="scss">
.workspace {
  &__note-editor {
    height: 100%;

    &__wrapper {
      height: 100%;
    }
  }
}

.note-loading-enter-active,
.note-loading-leave-active {
  transition: opacity 0.1s ease;
}

.note-loading-enter-from,
.note-loading-leave-to {
  opacity: 0;
}
</style>
