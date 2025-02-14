<script setup lang="ts">
import type { LocationQueryValue } from '#vue-router';

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

const currentItemForDetails = useCurrentItemForDetails();

const isShowingShortcuts = ref(false);
const isShowingSearch = ref(false);
mitt.on('search:show', () => isShowingSearch.value = true);
mitt.on('shortcuts:show', () => isShowingShortcuts.value = true);

const isNoteEmpty = computed(() => !route.params.note || route.params.note === BLANK_NOTE_NAME);

watch(isShowingSearch, async (search, _, onCleanup) => {
  let newQuery: Record<string, LocationQueryValue | Array<LocationQueryValue>>;
  if (search) {
    newQuery = { ...route.query, search: null };
  }
  else {
    const { search, ...queryWithoutSearch } = route.query;
    newQuery = queryWithoutSearch;
  }

  onCleanup(
    on(window, 'popstate', () => {
      isShowingSearch.value = false;
    }, { once: true }),
  );

  await navigateTo({ query: newQuery });
});

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
    noteContainerEl.value?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  },
  [shortcuts.scrollToBottom]: () => {
    noteContainerEl.value?.scrollTo({
      top: noteContainerEl.value.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
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

onMounted(() => {
  isShowingSearch.value = route.query.search !== undefined;
});
</script>

<template>
  <div id="workspace" class="workspace">
    <LazyWorkspaceToolbox />

    <main ref="noteContainerEl" class="workspace__note">
      <LazyWorkspaceBannerNoConnection v-if="isFallback" />

      <WithFadeTransition>
        <LazyWorkspaceWelcome v-if="isNoteEmpty" />

        <div v-else style="height: 100%;">
          <NuxtPage :transition="{ name: 'fade' }" :note-container-el />
        </div>
      </WithFadeTransition>
    </main>

    <LazyWorkspaceContents />

    <Teleport to="#teleports">
      <Transition name="search-fade">
        <LazyWorkspaceSearch
          v-if="isShowingSearch"
          @close="isShowingSearch = false"
        />
      </Transition>
    </Teleport>

    <Teleport to="#teleports">
      <WithFadeTransition>
        <LazyWorkspaceShortcuts
          v-if="isShowingShortcuts"
          @close="isShowingShortcuts = false"
        />
      </WithFadeTransition>
    </Teleport>

    <Teleport to="#teleports">
      <WithFadeTransition>
        <LazyWorkspaceItemDetails
          v-if="currentItemForDetails"
          :item="currentItemForDetails"
        />
      </WithFadeTransition>
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
