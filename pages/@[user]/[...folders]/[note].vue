<script setup lang="ts">
import { withoutLeadingSlash } from 'ufo';

import type { Note } from '@prisma/client';
import { blankNoteName } from '~/assets/constants';

const router = useRouter();
const route = useRoute();
const isOnline = useOnline();
const notesCache = useNotesCache();
const currentNoteState = useCurrentNoteState();

const note = ref<Note | null | undefined>(notesCache.get(`/${route.params.user}/${getUniqueNoteKey()}`));

const { data: fetchedNote, error, refresh } = useLazyAsyncData<Note | null>(async () => {
  currentNoteState.value = '';

  if (!route.params.note || route.params.note === blankNoteName)
    return null;

  currentNoteState.value = 'fetching';

  return $fetch<Note>(`/api/note/${getUniqueNoteKey()}`, { retry: 2 });
}, { server: false });

const throttledUpdate = useThrottleFn(updateNote, 1000);
function updateNote(content: string) {
  if (!note.value) return;

  if (note.value.content === content) return;

  interface QuickResponse { status: 'ok' | 'error' }

  const newNote: Partial<Note> = { content };

  const updatePath = `/api/note/${getUniqueNoteKey()}`;

  if (isOnline.value) notesCache.set(note.value.path, { ...note.value, ...newNote });

  currentNoteState.value = 'updating';

  $fetch<QuickResponse>(updatePath, { method: 'PUT', body: newNote })
    .then((response) => {
      if (response.status === 'error' || !note.value) return;

      notesCache.set(note.value.path, { ...note.value, ...newNote });

      currentNoteState.value = 'saved';
    })
    .catch((error) => console.warn(error));
}

function getUniqueNoteKey() {
  const paths = Array.isArray(route.params.folders)
    ? [route.params.folders, route.params.note]
    : [route.params.note];

  return withoutLeadingSlash(
    paths
      .map((string) => encodeURIComponent(string as string))
      .join('/'),
  );
}

watch(error, (error) => {
  if (!error) return;

  router.push({ ...route, params: { note: blankNoteName } });
});

watch(fetchedNote, (value) => {
  if (!value) return;

  note.value = value;
  notesCache.set(value.path, value);
  currentNoteState.value = 'saved';
});
</script>

<template>
  <Transition name="note-loading" appear>
    <template v-if="note">
      <!-- NOTE: This component should be wrapped inside client only, if note is rendered on server -->
      <WorkspaceNoteEditor
        key="content"
        class="workspace__note-editor"
        :content="note.content || ''"
        @refresh="refresh"
        @update="throttledUpdate"
      />
    </template>

    <template v-else>
      <PlaceholderNoteEditor key="skeleton" />
    </template>
  </Transition>
</template>

<style lang="scss">
.workspace {
  &__note-editor {
    width: 100%;
    height: 100%;

    max-width: 1300px;

    margin: 0 auto;
  }
}

.note-loading-enter-active,
.note-loading-appear-active {
  transition: opacity 0.25s * 2;
}

.note-loading-enter-active.skeleton {
  transition-delay: 0.25s;
}

.note-loading-leave-active {
  display: none;
}

.note-loading-enter-from,
.note-loading-leave-to {
  opacity: 0;
}
</style>
