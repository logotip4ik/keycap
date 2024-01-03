<script setup lang="ts">
import parseDuration from 'parse-duration';

definePageMeta({
  scrollToTop: true,
});

const route = useRoute();
const isFallbackMode = useFallbackMode();
const notesCache = useNotesCache();
const createToast = useToaster();
const offlineStorage = useOfflineStorage();
const currentItemForDetails = useCurrentItemForDetails();
const user = useUser();
const mitt = useMitt();

const notePath = computed(() => route.path.replace('/@', '/'));
const noteApiPath = computed(() => route.path.replace(`/@${route.params.user}`, ''));

const POLLING_TIME = parseDuration('2 minutes')!;
let pollingTimer: NodeJS.Timeout;
let loadingToast: ToastInstance | undefined;
let abortControllerGet: AbortController | undefined;
let lastRefetch: number | undefined;

const { data: note, refresh } = await useAsyncData<NoteWithContent | undefined>('note', async () => {
  if (import.meta.server || !route.params.note || route.params.note === BLANK_NOTE_NAME)
    return;

  clearTimeout(pollingTimer);

  abortControllerGet?.abort();
  abortControllerGet = new AbortController();

  lastRefetch = Date.now();

  loadingToast = createToast('Fetching note takes longer then expected...', {
    delay: parseDuration('1 minute'),
    type: 'loading',
  });

  let hydrationPromise = getHydrationPromise();

  $fetch(`/api/note${noteApiPath.value}`, { signal: abortControllerGet.signal })
    .then(async (res) => {
      if (!res)
        return;

      const { data: fetchedNote } = res;
      isFallbackMode.value = false;

      notesCache.set(fetchedNote.path, fetchedNote);
      offlineStorage.setItem?.(fetchedNote.path, fetchedNote);

      hydrationPromise && await hydrationPromise;
      hydrationPromise = undefined;

      note.value = fetchedNote;
    })
    .catch((e) => {
      handleError(e);
      throw e;
    })
    .finally(() => {
      const multiplier = document.visibilityState === 'visible' ? 1 : 2;
      pollingTimer = setTimeout(refresh, POLLING_TIME * multiplier);

      loadingToast?.remove();
    });

  hydrationPromise && await hydrationPromise;
  hydrationPromise = undefined;

  return notesCache.get(notePath.value) || await offlineStorage.getItem?.(notePath.value);
}, {
  server: false,
  lazy: true,
  deep: false,
});

let abortControllerUpdate: AbortController | null;
const throttledUpdate = useThrottleFn(updateNote, 1500, true, false); // enable trailing call and disable leading
function updateNote(content: string) {
  // if no note was found in cache that means that it was deleted
  if (!notesCache.has(notePath.value))
    return;

  const newNote = { ...notesCache.get(notePath.value), content };

  // enables optimistic ui
  notesCache.set(newNote.path, newNote);

  abortControllerUpdate?.abort();
  abortControllerUpdate = new AbortController();

  $fetch(`/api/note${noteApiPath.value}`, {
    method: 'PATCH',
    body: { content },
    retry: 2,
    signal: abortControllerUpdate.signal,
  })
    .then(() => offlineStorage.setItem?.(newNote.path, newNote))
    .catch((error) => console.warn(error));
}

async function handleError(error: Error) {
  if (await baseHandleError(error) || note.value)
    return;

  // last chance to show user folder, if iterator in @[user].vue page hasn't yet set the foldersCache
  const offlineNote = await offlineStorage.getItem?.(notePath.value);

  if (!offlineNote || typeof offlineNote !== 'object') {
    createToast(`Sorry ⊙︿⊙ We couldn't find offline note copy: "${route.params.note}"`);

    await navigateTo(`/@${user.value!.username}`);

    return;
  }

  note.value = offlineNote as NoteWithContent;
}

mitt.on('cache:populated', () => {
  if (!note.value)
    note.value = notesCache.get(notePath.value) || null;
});

mitt.on('details:show', () => {
  if (note.value)
    // @ts-expect-error it will be okeeeeeey
    currentItemForDetails.value = note.value;
});

if (import.meta.client) {
  const off = on(document, 'visibilitychange', () => {
    const timeDiff = Date.now() - (lastRefetch || 0);

    if (document.visibilityState === 'visible' && timeDiff > parseDuration('10 seconds')!)
      refresh();
  });

  onBeforeUnmount(() => {
    off();
    clearTimeout(pollingTimer);
    abortControllerGet?.abort();
    loadingToast?.remove();

    abortControllerGet = undefined;
    loadingToast = undefined;
  });
}
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
      @update="throttledUpdate"
    />

    <WorkspaceNoteEditorSkeleton
      v-else
      key="skeleton"
      class="workspace__note-editor"
    />
  </WithFadeTransition>
</template>

<style lang="scss">
.workspace {
  &__note-editor {
    width: 97.5%;
    height: 100%;

    max-width: 1300px;

    margin: 0 auto;

    @media (max-width: $breakpoint-tablet) {
      width: 100%;
    }
  }
}
</style>
