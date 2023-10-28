<script setup lang="ts">
definePageMeta({
  validate(route) {
    const user = useUser();

    return (user.value || false) && route.params.user === user.value.username;
  },
});

const route = useRoute();
const user = useUser();
const mitt = useMitt();
const { shortcuts } = useAppConfig();

const currentNoteState = useCurrentNoteState();
const currentItemForDetails = useCurrentItemForDetails();

const isShowingSearch = ref(false);
mitt.on('search:show', () => isShowingSearch.value = true);

const isNoteEmpty = computed(() => !route.params.note || route.params.note === BLANK_NOTE_NAME);

function focusSearchInput(event: Element) {
  nextTick(() => event.querySelector('input')?.focus());
}

watch(() => route.params.note, (noteName) => {
  const isEmptyNoteName = !noteName || noteName === BLANK_NOTE_NAME;

  if (isEmptyNoteName) currentNoteState.value = '';
});

let popstateOff: (() => any) | undefined;
watch(isShowingSearch, async (search) => {
  popstateOff?.();
  const query = { ...route.query };

  // `undefined` and empty array removes param from query
  // `null` means that query param should be there but value should be empty
  // @ts-expect-error idk why it is not happy, but it works
  query.search = search ? null : undefined;
  popstateOff = on(window, 'popstate', () => isShowingSearch.value = false);

  await navigateTo({ ...route, query });
});

useHead({
  title: () => !isNoteEmpty.value
    ? (route.params.note as string)
    : ((route.params.folders && route.params.folders.at(-1)) || ''),
  titleTemplate: (name) => {
    return name
      ? `${name} | ${user.value!.username} - Keycap`
      : `${user.value!.username} - Keycap`;
  },
});

useTinykeys({
  [shortcuts.search]: (event) => {
    event.preventDefault();

    if (currentItemForDetails.value)
      currentItemForDetails.value = null;

    isShowingSearch.value = !isShowingSearch.value;
  },
});

onMounted(() => {
  if (typeof route.query.search !== 'undefined')
    isShowingSearch.value = true;

  [preloadDashboardComponents, defineFuzzyWorker]
    .map((cb) => requestIdleCallback(cb));

  if (import.meta.dev)
    // @ts-expect-error this should not be defined
    window.$createToast = useToast();
});

onBeforeUnmount(() => popstateOff?.());
</script>

<template>
  <div id="workspace" class="workspace">
    <LazyWorkspaceToolbox />

    <Transition name="fade" appear>
      <LazyWorkspaceWelcome v-if="isNoteEmpty" />

      <main v-else class="workspace__note">
        <NuxtPage />
      </main>
    </Transition>

    <LazyWorkspaceContents />

    <Teleport to="body">
      <Transition
        name="search-fade"
        @after-enter="focusSearchInput"
      >
        <LazyWorkspaceSearch
          v-if="isShowingSearch"
          @close="isShowingSearch = false"
        />
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <LazyWorkspaceItemDetails
          v-if="currentItemForDetails"
          :item="currentItemForDetails"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss">
.workspace {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  height: 100vh;
  height: 100svh;

  &__note {
    --scrollbar-thumb-color: hsla(var(--text-color-hsl), 0.175);
    --scrollbar-background: hsla(var(--text-color-hsl), 0.025);

    flex: 1;

    width: 100%;
    height: 100%;

    will-change: width, opacity;

    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-background);
    &::-webkit-scrollbar {
      width: 0.5rem;

      background: var(--scrollbar-background);
    }

    &::-webkit-scrollbar-thumb {
      width: 0.5rem;

      background-color: var(--scrollbar-thumb-color);
    }
  }
}
</style>
