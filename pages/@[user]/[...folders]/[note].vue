<script setup lang="ts">
import { withoutLeadingSlash } from 'ufo';

import type { Note } from '@prisma/client';
import type { ToastInstance } from '~/composables/toasts';

import { blankNoteName } from '~/assets/constants';

const route = useRoute();
const isFallbackMode = useFallbackMode();
const notesCache = useNotesCache();
const currentNoteState = useCurrentNoteState();
const createToast = useToast();
const offlineStorage = useOfflineStorage();
const mitt = useMitt();

// NOTE: can't use default param in async data because it runs
// before route navigation and our notes depends on route path
const note = shallowRef<Note | null | undefined>(
  notesCache.get(`/${route.params.user}/${getApiNotePath()}`),
);

let firstTimeFetch = true;
let loadingToast: undefined | ToastInstance;
const { data: fetchedNote, error, refresh } = useLazyAsyncData<Note | null>(
  'note',
  async () => {
    currentNoteState.value = '';

    if (!route.params.note || route.params.note === blankNoteName)
      return null;

    currentNoteState.value = 'fetching';

    return $fetch(`/api/note/${getApiNotePath()}`, {
      retry: 2,
      onRequest: () => {
        if (!loadingToast) {
          loadingToast = createToast('Fetching note. Please wait...', {
            duration: 999999,
            delay: firstTimeFetch ? 3500 : 0,
            type: 'loading',
          });
          firstTimeFetch = false;
        }
      },
      onResponse: () => {
        loadingToast?.remove();
      },
    });
  },
  { server: false },
);

let abortController: AbortController | null;
const throttledUpdate = useThrottleFn(updateNote, 1000);
function updateNote(content: string) {
  // if no note was found in cache that means that it was deleted
  if (!note.value || !notesCache.get(`/${route.params.user}/${getApiNotePath()}`))
    return;

  const newNote: Partial<Note> = { content };

  const updatePath = `/api/note/${getApiNotePath()}`;

  // enables optimistic ui
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
      if (note.value)
        notesCache.set(note.value.path, { ...note.value, ...newNote });

      // before route update, note will be saved and the indicator will be again reset to saved
      // this checks if route is the same, so this wasn't last save and user is still on the same note
      if (routeBeforeUpdate === window.location.pathname)
        currentNoteState.value = 'saved';
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

mitt.on('cache:populated', () => {
  note.value = notesCache.get(`/${route.params.user}/${getApiNotePath()}`);
});

watch(error, async (error) => {
  // Resetting fallback mode to false is previous error is removed
  if (!error)
    return isFallbackMode.value = false;

  // No network connection
  if (error.name === 'FetchError')
    isFallbackMode.value = true;

  // But note was found in cache just display it
  if (note.value)
    return;

  const notePath = `/${route.params.user}/${getApiNotePath()}`;

  const offlineNote = await offlineStorage.value?.getItem(notePath) as Note;

  // if offline storage hasn't got the note, navigate to root of in hope folder is in cache
  if (!offlineNote) {
    createToast('No offline copy found');

    await navigateTo({ ...route, params: { note: blankNoteName } });

    return;
  }

  note.value = offlineNote;
});

watch(fetchedNote, (value) => {
  if (!value) return;

  note.value = value;
  notesCache.set(value.path, toRaw(value));
  currentNoteState.value = 'saved';

  isFallbackMode.value = false;
  offlineStorage?.value?.setItem(value.path, toRaw(value));
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
        :editable="!isFallbackMode && !!note"
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
}
</style>
