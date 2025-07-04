<script setup lang="ts">
definePageMeta({
  validate(route) {
    const user = useUser();

    return (user.value || false) && route.params.user === user.value.username;
  },
});

const route = useRoute();
const user = useRequiredUser();
const mitt = useMitt();
const isFallback = useFallbackMode();
const { shortcuts } = useAppConfig();

const noteContainerEl = useTemplateRef('noteContainerEl');
provide(NoteContainerKey, noteContainerEl);

const currentItemForDetails = useCurrentItemForDetails();

const isShowingShortcuts = ref(false);
const isShowingSearch = ref(false);
mitt.on('search:show', () => isShowingSearch.value = true);
mitt.on('shortcuts:show', () => isShowingShortcuts.value = true);

const isNoteEmpty = computed(() => !route.params.note || route.params.note === BLANK_NOTE_NAME);

useHead({
  title: () => isNoteEmpty.value
    ? ((route.params.folders && route.params.folders.at(-1)) || '')
    : (route.params.note as string),
  titleTemplate: (name) => {
    return name
      ? `${name} | ${user.value.username} - Keycap`
      : `${user.value.username} - Keycap`;
  },
});

useTinykeys({
  [shortcuts.search]: (event) => {
    event.preventDefault();

    isShowingSearch.value = !isShowingSearch.value;

    currentItemForDetails.value = undefined;
    isShowingShortcuts.value = false;
  },
  [shortcuts.scrollToTop]: () => {
    if (isNoteEmpty.value) {
      return;
    }
    noteContainerEl.value?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  },
  [shortcuts.scrollToBottom]: () => {
    if (isNoteEmpty.value) {
      return;
    }
    noteContainerEl.value?.scrollTo({
      top: noteContainerEl.value.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  },
  [shortcuts.shortcutsModal]: (event) => {
    const element = event.target as HTMLElement;

    if (element.isContentEditable || element.tagName === 'INPUT') {
      return;
    }

    isShowingShortcuts.value = true;
    isShowingSearch.value = false;
    currentItemForDetails.value = undefined;

    event.preventDefault();
  },
});

if (import.meta.client) {
  prepareWorkspace();

  if (import.meta.dev) {
    // @ts-expect-error this should not be defined
    window.$createToast = useToaster();
    // @ts-expect-error this should not be defined
    window.$isFallback = useFallbackMode();
  }
}
else {
  const isRootPath = route.params.user === user.value.username
    && !route.params.folders
    && (!route.params.note || route.params.note === BLANK_NOTE_NAME);

  if (
    isRootPath
    && getSetting(settings.autoOpenRecent).value === 'yes'
  ) {
    const event = useRequestEvent()!;
    const fetch = useRequestFetch();
    const recents = await fetch('/api/recent', {
      responseType: 'json',
      headers: protectionHeaders,
    }).catch(async (err) => {
      await logger.error(event, { err, msg: 'failed fetching recents for `autoOpenRecent`' });
      return undefined;
    });

    if (recents?.data?.[0]) {
      const recentNotePath = generateItemPath(recents.data[0]);
      if (recentNotePath !== route.path) {
        await showItem(recents.data[0]);
      }
    }
  }
}
</script>

<template>
  <div id="workspace" class="workspace">
    <LazyWorkspaceToolbox />

    <main ref="noteContainerEl" class="workspace__note">
      <LazyWorkspaceBannerNoConnection v-if="isFallback" />

      <WithFadeTransition>
        <LazyWorkspaceWelcome v-if="isNoteEmpty" />

        <div v-else style="height: 100%;">
          <NuxtPage :transition="{ name: 'fade' }" />
        </div>
      </WithFadeTransition>
    </main>

    <LazyWorkspaceContents />

    <Teleport to="#teleports">
      <WithModalTransition>
        <LazyWorkspaceSearch v-if="isShowingSearch" @close="isShowingSearch = false" />
      </WithModalTransition>
    </Teleport>

    <Teleport to="#teleports">
      <WithModalTransition>
        <LazyWorkspaceShortcuts v-if="isShowingShortcuts" @close="isShowingShortcuts = false" />
      </WithModalTransition>
    </Teleport>

    <Teleport to="#teleports">
      <WithModalTransition>
        <LazyWorkspaceItemDetails v-if="currentItemForDetails" :item="currentItemForDetails" />
      </WithModalTransition>
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
    --scrollbar-width: 0.33rem;
    --scrollbar-thumb-color: hsla(var(--text-color-hsl), 0.175);
    --scrollbar-background: hsla(var(--text-color-hsl), 0.025);

    position: relative;

    flex: 1;

    width: 100%;
    height: 100%;

    overflow-y: auto;

    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-background);

    &::-webkit-scrollbar {
      width: var(--scrollbar-width);

      background: var(--scrollbar-background);
    }

    &::-webkit-scrollbar-thumb {
      width: var(--scrollbar-width);

      background-color: var(--scrollbar-thumb-color);
    }
  }
}
</style>
