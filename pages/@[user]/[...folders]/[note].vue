<script setup lang="ts">
const route = useRoute();
const isFallbackMode = useFallbackMode();
const notesCache = useNotesCache();
const createToast = useToaster();
const offlineStorage = useOfflineStorage();
const currentItemForDetails = useCurrentItemForDetails();
const user = useUser();
const mitt = useMitt();

const note = shallowRef<NoteWithContent>();

const noteApiPath = computed(() => route.path.substring(2 + user.value!.username.length));
const notePath = computed(() => `/${user.value!.username}${noteApiPath.value}`);

const POLLING_TIME = parseDuration('2 minutes')!;
let pollingTimer: ReturnType<typeof setTimeout>;
let loadingToast: ToastInstance | undefined;
let abortControllerGet: AbortController | undefined;
let lastRefetch: number | undefined;

async function fetchNote() {
  if (import.meta.server || !route.params.note || route.params.note === BLANK_NOTE_NAME) {
    return;
  }

  clearTimeout(pollingTimer);

  abortControllerGet?.abort();
  abortControllerGet = new AbortController();

  lastRefetch = Date.now();

  loadingToast = createToast('This is cached note, wait for new one to arrive...', {
    delay: parseDuration('3 seconds'),
    type: 'loading',
  });

  let hydrationPromise = getHydrationPromise();

  $fetch(`/api/note${noteApiPath.value}`, { signal: abortControllerGet.signal })
    .then(async (res) => {
      if (!res) {
        return;
      }

      const { data: fetchedNote } = res as { data: NoteWithContent };
      isFallbackMode.value = false;

      notesCache.set(fetchedNote.path, fetchedNote);
      offlineStorage.setItem(fetchedNote.path, fetchedNote);

      note.value = fetchedNote;
    })
    .catch((e) => {
      handleError(e);
    })
    .finally(() => {
      const multiplier = document.visibilityState === 'visible' ? 1 : 2;
      pollingTimer = setTimeout(fetchNote, POLLING_TIME * multiplier);

      loadingToast?.remove();
    });

  const cachedNote = notesCache.get(notePath.value) || await offlineStorage.getItem(notePath.value);

  if (hydrationPromise) {
    await hydrationPromise;
    hydrationPromise = undefined;
  }

  return cachedNote;
}

let retryInterval: ReturnType<typeof setInterval> | undefined;
let failedSaveToast: ToastInstance | undefined;
let abortControllerUpdate: AbortController | undefined;
const throttledNoteUpdate = useThrottleFn(updateNote, 1500, true, false); // enable trailing call and disable leading
function updateNote(content: string) {
  // if no note was found in cache that means that it was deleted
  if (!notesCache.has(notePath.value)) {
    return;
  }

  const newNote = { ...notesCache.get(notePath.value), content };

  notesCache.set(newNote.path, newNote);

  const innerUpdate = (note: NoteWithContent) => {
    abortControllerUpdate?.abort();
    abortControllerUpdate = new AbortController();

    $fetch(`/api/note${noteApiPath.value}`, {
      method: 'PATCH',
      body: { content },
      retry: 2,
      signal: abortControllerUpdate.signal,
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
  innerUpdate(newNote);
}

async function handleError(error: Error) {
  if (await baseHandleError(error) || note.value) {
    createToast('Failed to fetch current note, showing cached one.');
    return;
  }

  const offlineNote = await offlineStorage.getItem(notePath.value);

  if (!offlineNote || typeof offlineNote !== 'object') {
    createToast(`Sorry ⊙︿⊙ We couldn't find offline note copy: "${route.params.note}"`);

    await navigateTo(`/@${user.value!.username}`);

    return;
  }

  note.value = offlineNote as NoteWithContent;
}

mitt.on('details:show', () => {
  if (note.value) {
    currentItemForDetails.value = note.value;
  }
});

onBeforeMount(() => {
  fetchNote();

  const offVisibility = on(document, 'visibilitychange', () => {
    const timeDiff = Date.now() - (lastRefetch || 0);

    if (document.visibilityState === 'visible' && timeDiff > parseDuration('10 seconds')!) {
      fetchNote();
    }
  });

  // MDN: `event.persisted` indicates if the document is loading from a cache
  const offPageShow = on(window, 'pageshow', (event) => event.persisted && fetchNote());

  onBeforeUnmount(() => {
    offPageShow();
    offVisibility();
    clearTimeout(pollingTimer);
    clearInterval(retryInterval);
    abortControllerGet?.abort();
    loadingToast?.remove();
    failedSaveToast?.remove();

    abortControllerGet = undefined;
    loadingToast = undefined;
    failedSaveToast = undefined;
  });
});
</script>

<!-- NOTE: NoteEditor component should be wrapped inside client only, if note is rendered on server -->

<template>
  <WithFadeTransition>
    <WorkspaceNoteEditor
      v-if="note"
      key="content"
      class="workspace__note-editor"
      :content="note.content || ''"
      :editable="!isFallbackMode && !!note"
      @update="throttledNoteUpdate"
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
