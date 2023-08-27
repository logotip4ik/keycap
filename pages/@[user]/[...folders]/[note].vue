<script setup lang="ts">
import { withoutLeadingSlash } from 'ufo';
import parseDuration from 'parse-duration';

import type { RefToastInstance } from '~/composables/toasts';

const route = useRoute();
const isFallbackMode = useFallbackMode();
const notesCache = useNotesCache();
const currentNoteState = useCurrentNoteState();
const createToast = useToast();
const offlineStorage = useOfflineStorage();
const currentItemForDetails = useCurrentItemForDetails();
const mitt = useMitt();
const user = useUser();

const notePath = computed(() => {
  const paths = Array.isArray(route.params.folders)
    ? [...route.params.folders, route.params.note]
    : [route.params.note];

  const pathString = withoutLeadingSlash(
    paths
      .map((string) => encodeURIComponent(string as string))
      .join('/'),
  );

  return `/${route.params.user}/${pathString}`;
});
const noteApiPath = computed(() => notePath.value.split('/').slice(2).join('/'));

// NOTE: can't use default param in async data because it runs
// before route navigation and our notes depends on route path
const note = shallowRef<SerializedNote | null>(
  notesCache.get(notePath.value) || null,
);

const POLLING_TIME = parseDuration('2 minutes')!;
let pollingTimer: NodeJS.Timeout;
let firstTimeFetch = true;
let loadingToast: RefToastInstance;
let abortControllerGet: AbortController | null;

const { data: fetchedNote, pending, error, refresh } = useAsyncData<SerializedNote | undefined>(
  'note',
  // TODO: rework this handler to be similar to what is in `ContentsList`
  async () => {
    clearTimeout(pollingTimer);

    currentNoteState.value = '';

    if (!route.params.note || route.params.note === BLANK_NOTE_NAME)
      return;

    if (!note.value) {
      offlineStorage.value?.getItem(notePath.value)
        .then((noteCopy) => noteCopy && (note.value = noteCopy));
    }

    currentNoteState.value = 'fetching';

    if (!loadingToast?.value) {
      loadingToast = createToast('Fetching note. Please wait...', {
        duration: parseDuration('1 minute')!,
        delay: firstTimeFetch ? 3500 : 250,
        type: 'loading',
      });

      firstTimeFetch = false;
    }

    abortControllerGet = new AbortController();

    return await $fetch<SerializedNote>(
      `/api/note/${noteApiPath.value}`,
      { retry: 2, signal: abortControllerGet.signal },
    )
      .finally(() => {
        loadingToast.value?.remove();

        const multiplier = document.visibilityState === 'visible' ? 1 : 2;
        pollingTimer = setTimeout(refresh, POLLING_TIME * multiplier);
      });
  },
  { server: false, lazy: true },
);

let abortControllerUpdate: AbortController | null;
const throttledUpdate = useThrottleFn(updateNote, 1000, true, false); // enable trailing call and disable leading
function updateNote(content: string) {
  const updatingCurrentNote = notePath.value.replace('/', '/@') === window.location.pathname;

  // send update request after get
  if (pending.value && updatingCurrentNote) {
    const stop = watch(pending, (pending) => {
      if (!pending) {
        updateNote(content);
        stop();
      }
    });

    return;
  }

  // if no note was found in cache that means that it was deleted
  if (!note.value || !notesCache.get(notePath.value))
    return;

  const newNote = { ...toRaw(note.value), content };

  // enables optimistic ui
  notesCache.set(note.value.path, newNote);

  if (updatingCurrentNote)
    currentNoteState.value = 'updating';

  abortControllerUpdate?.abort();
  abortControllerUpdate = new AbortController();

  $fetch<QuickResponse>(`/api/note/${noteApiPath.value}`, {
    method: 'PATCH',
    body: { content },
    retry: 2,
    signal: abortControllerUpdate.signal,
  })
    .then(() => {
      if (note.value)
        offlineStorage.value?.setItem(note.value.path, newNote);

      // before route update, note will be saved and the indicator will be again reset to saved
      // this checks if route is the same, so this wasn't last save and user is still on the same note
      if (updatingCurrentNote)
        currentNoteState.value = 'saved';
    })
    .catch((error) => console.warn(error));
}

function showDetails() {
  // @ts-expect-error idk why it is complaining
  currentItemForDetails.value = note.value!;
}

mitt.on('cache:populated', () => {
  if (!note.value)
    note.value = notesCache.get(notePath.value) || null;
});

mitt.on('details:show', () => {
  if (note.value)
    showDetails();
});

watch(error, async (error) => {
  // @ts-expect-error second error is actually nuxt error
  if (isNuxtError(error))
    return;

  // Resetting fallback mode to false is previous error is removed
  if (!error)
    return isFallbackMode.value = false;

  // @ts-expect-error there actually is statusCode
  if (error.statusCode === 401 || !user.value) {
    user.value = null;
    await navigateTo('/login');
    return;
  }

  // @ts-expect-error there actually is statusCode
  if (error.statusCode === 404) {
    await navigateTo(`/@${user.value.username}`);
    return;
  }

  // Some other network error
  if (error.name === 'FetchError')
    isFallbackMode.value = true;

  // But note was found in cache just display it
  if (note.value)
    return;

  const offlineNote = await offlineStorage.value?.getItem(notePath.value);

  // if offline storage hasn't got the note, navigate to root of in hope folder is in cache
  if (!offlineNote) {
    createToast(`Sorry ⊙︿⊙ We can't find offline copy for note: "${route.params.note}"`);

    await navigateTo({ ...route, params: { note: BLANK_NOTE_NAME } });

    return;
  }

  note.value = offlineNote;
});

watch(fetchedNote, (value) => {
  if (!value) return;

  note.value = toRaw(value);
  notesCache.set(value.path, toRaw(value));
  currentNoteState.value = 'saved';

  isFallbackMode.value = false;
  offlineStorage.value?.setItem(value.path, toRaw(value));
});

onMounted(() => {
  const off = on(document, 'visibilitychange', () => {
    if (document.visibilityState === 'visible')
      refresh();
  });

  onBeforeUnmount(() => {
    off();

    clearTimeout(pollingTimer);
    abortControllerGet?.abort();
  });
});
</script>

<template>
  <Transition name="fade" appear>
    <!-- NOTE: This component should be wrapped inside client only, if note is rendered on server -->
    <WorkspaceNoteEditor
      v-if="note"
      key="content"
      class="workspace__note-editor"
      :content="note.content || ''"
      :editable="!isFallbackMode && !!note"
      @update="throttledUpdate"
      @show-details="showDetails"
    />

    <WorkspaceNoteEditorSkeleton
      v-else
      key="skeleton"
      class="workspace__note-editor"
    />
  </Transition>
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
