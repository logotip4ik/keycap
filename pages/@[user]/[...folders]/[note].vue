<script setup lang="ts">
import type { Note } from '@prisma/client';
import { withLeadingSlash } from 'ufo';
import type { Updatable } from '~/composables/store';

const route = useRoute();
const isOnline = useOnline();
const notesCache = useNotesCache();

const note = ref<Note | null | undefined>(notesCache.get(`/${route.params.user}${getUniqueNoteKey()}`));

const { data: fetchNote, pending } = useLazyFetch<Note>(() => `/api/note${getUniqueNoteKey()}`, {
  server: false,
});

const throttledUpdate = useThrottleFn(updateNote, 500);
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
</script>?.content

<template>
  <div v-if="pending && !note">
    loading placeholder
  </div>
  <ClientOnly v-else-if="note">
    <WorkspaceNoteEditor class="workspace__note-editor" :content="note.content || ''" @update="throttledUpdate" />
  </ClientOnly>
</template>

<style lang="scss">
.workspace {
  &__note-editor {
    height: 100%;

    overflow-y: auto;
  }
}
</style>
