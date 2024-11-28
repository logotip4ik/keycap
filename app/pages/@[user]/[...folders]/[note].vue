<script setup lang="ts">
const route = useRoute();
const isFallbackMode = useFallbackMode();
const notesCache = useNotesCache();
const createToast = useToaster();
const offlineStorage = getOfflineStorage();
const currentItemForDetails = useCurrentItemForDetails();
const user = useRequiredUser();
const mitt = useMitt();

const noteApiPath = computed(() => route.path.substring(2 + user.value.username.length));
const notePath = computed(() => `/${user.value.username}${noteApiPath.value}`);
const shouldSkipFetching = computed(() => !route.params.note || route.params.note === BLANK_NOTE_NAME);

const { data: note, refresh } = useKFetch<NoteWithContent>(() => `/api/note${noteApiPath.value}`, {
  deep: false,
  skip: shouldSkipFetching,
  pollingTime: parseDuration('2 minutes')!,
  onResponse: (note) => {
    notesCache.set(note.path, note);
    offlineStorage.setItem(note.path, note);
  },
  getCached: ({ inErrorBlock }) => {
    const cached = notesCache.get(notePath.value);

    if (cached) {
      return cached;
    }

    return offlineStorage.getItem(notePath.value)
      .then(async (offlineCopy) => {
        if (inErrorBlock && !offlineCopy) {
          createToast(`Sorry ⊙︿⊙ We couldn't find offline note copy: "${route.params.note}".`);

          await navigateTo(`/@${user.value.username}`);

          return;
        }

        return offlineCopy as NoteWithContent;
      });
  },
  getLoadingToast: ({ hasCachedItem }) => createToast(
    hasCachedItem
      ? 'This is cached note, wait for new one to arrive...'
      : 'This shouldn\'t take a long time...',
    {
      delay: parseDuration('3 seconds'),
      type: 'loading',
      duration: Infinity,
    },
  ),
  getSuccessToast: () => createToast('Succeeded fetching note. Showing fresh one.'),
  getErrorToast: () => createToast('Failed to fetch current note, showing cached one.'),
});

let retryInterval: ReturnType<typeof setInterval> | undefined;
let failedSaveToast: ToastInstance | undefined;
const throttledUpdateNote = debounce(forcedUpdateNote, 550);
async function forcedUpdateNote(content: string, shouldStopSave?: AbortSignal) {
  // if no note was found in cache that means that it was deleted
  if (!notesCache.has(notePath.value)) {
    return;
  }

  const savePath = noteApiPath.value;
  const newNote = { ...notesCache.get(notePath.value), content };

  notesCache.set(newNote.path, newNote);

  const innerUpdate = async (note: NoteWithContent) => {
    if (shouldStopSave?.aborted) {
      return;
    }

    await kfetch(`/api/note${savePath}`, {
      method: 'PATCH',
      body: { content },
      retry: 2,
      signal: shouldStopSave,
      priority: 'high',
      // Keepalive has a body size limit of 64kb
      // keepalive: true,
    })
      .then(() => {
        offlineStorage.setItem(note.path, note);

        if (failedSaveToast) {
          isFallbackMode.value = false;

          failedSaveToast.remove();
          failedSaveToast = undefined;

          clearInterval(retryInterval);
          retryInterval = undefined;
        }
      })
      .catch((e) => {
        if (shouldStopSave?.aborted) {
          return;
        }

        sendError(e);

        if (!failedSaveToast) {
          isFallbackMode.value = true;

          failedSaveToast = createToast(`Fallback mode enabled. Failed to save "${note.name}" note, retrying...`, {
            type: 'loading',
            duration: Infinity,
            priority: 100,
          });

          retryInterval = setInterval(innerUpdate, parseDuration('2s'), newNote);
        }
      });
  };

  clearInterval(retryInterval);
  await innerUpdate(newNote);
}

let abortThrottledSave = new AbortController();
function updateNote(content: string, force?: boolean) {
  if (force) {
    abortThrottledSave && abortThrottledSave.abort();
    abortThrottledSave = new AbortController();

    return forcedUpdateNote(content);
  }

  return throttledUpdateNote(content, abortThrottledSave.signal);
}

mitt.on('refresh:note', () => refresh());

mitt.on('details:show:note', () => {
  if (note.value) {
    currentItemForDetails.value = note.value;
  }
});

if (import.meta.client) {
  onBeforeUnmount(() => {
    clearInterval(retryInterval);
    failedSaveToast?.remove();

    failedSaveToast = undefined;
  });
};
</script>

<!-- NOTE: NoteEditor component should be wrapped inside client only, if note is rendered on server -->

<template>
  <WithFadeTransition appear>
    <WorkspaceNoteEditor
      v-if="note"
      key="content"
      class="workspace__note-editor"
      :note
      :editable="!isFallbackMode && !!note"
      @update="updateNote"
      @refresh="refresh"
    />

    <WorkspaceNoteEditorSkeleton
      v-else
      key="skeleton"
      class="workspace__note-editor"
    />
  </WithFadeTransition>
</template>

<style lang="scss">
.workspace__note-editor {
  width: 97.5%;
  height: 100%;

  max-width: 1300px;

  margin: 0 auto;

  @media (max-width: $breakpoint-tablet) {
    width: 100%;
  }
}
</style>
