<script setup lang="ts">
import { withoutLeadingSlash } from 'ufo';

import type { Note } from '@prisma/client';
import { blankNoteName } from '~/assets/constants';

const route = useRoute();
const isOnline = useOnline();
const notesCache = useNotesCache();
const currentNoteState = useCurrentNoteState();

const note = shallowRef<Note | null | undefined>(
  notesCache.get(`/${route.params.user}/${getApiNotePath()}`),
);

const { data: fetchedNote, error, refresh } = useLazyAsyncData<Note | null>(
  'note',
  async () => {
    currentNoteState.value = '';

    if (!route.params.note || route.params.note === blankNoteName)
      return null;

    currentNoteState.value = 'fetching';

    return $fetch<Note>(`/api/note/${getApiNotePath()}`, { retry: 2 });
  },
  { server: false },
);

let abortController: AbortController | null;
const throttledUpdate = useThrottleFn(updateNote, 1000);
function updateNote(content: string) {
  if (!note.value) return;

  interface QuickResponse { status: 'ok' | 'error' }

  const newNote: Partial<Note> = { content };

  const updatePath = `/api/note/${getApiNotePath()}`;

  if (isOnline.value)
    notesCache.set(note.value.path, { ...note.value, ...newNote });

  currentNoteState.value = 'updating';

  abortController?.abort();
  abortController = new AbortController();

  const routeBeforeUpdate = window.location.pathname;

  $fetch<QuickResponse>(updatePath, {
    method: 'PUT',
    body: newNote,
    retry: 2,
    signal: abortController.signal,
  })
    .then((response) => {
      if (response.status === 'error' || !note.value) return;

      notesCache.set(note.value.path, { ...note.value, ...newNote });

      // before route update, note will be saved and the indicator will be again reset to saved
      // this checks if route is the same, so this wasn't last save and user is still on the same note
      if (routeBeforeUpdate === window.location.pathname)
        currentNoteState.value = 'saved';
      else
        currentNoteState.value = '';
    })
    .catch((error) => console.warn(error));
}

function getApiNotePath() {
  const paths = Array.isArray(route.params.folders)
    ? [route.params.folders, route.params.note]
    : [route.params.note];

  return withoutLeadingSlash(
    paths
      .map((string) => encodeURIComponent(string as string))
      .join('/'),
  );
}

watch(error, async (error) => {
  if (error && !notesCache.has(`/${route.params.user}/${getApiNotePath()}`))
    await navigateTo({ ...route, params: { note: blankNoteName } });
});

watch(fetchedNote, (value) => {
  if (!value) return;

  note.value = value;
  notesCache.set(value.path, toRaw(value));
  currentNoteState.value = 'saved';
});
</script>

<template>
  <Transition name="fade" appear>
    <template v-if="note">
      <!-- NOTE: This component should be wrapped inside client only, if note is rendered on server -->
      <WorkspaceNoteEditor
        key="content"
        class="workspace__note-editor"
        :content="note.content || ''"
        :editable="!!(isOnline && note)"
        @refresh="refresh"
        @update="throttledUpdate"
      />
    </template>

    <template v-else>
      <WorkspaceNoteEditorSkeleton
        key="skeleton"
        class="workspace__note-editor"
      />
    </template>
  </Transition>
</template>

<style lang="scss">
.workspace {
  &__note-editor {
    width: 95%;
    height: 100%;

    max-width: 1300px;

    margin: 0 auto;

    @media screen and (max-width: $breakpoint-tablet) {
      width: 100%;
    }
  }

  .fade-enter-active.skeleton {
    transition-delay: 0.25s;
  }
}
</style>
