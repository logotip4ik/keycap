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
const isFallback = useFallbackMode();
const { shortcuts } = useAppConfig();

const currentItemForDetails = useCurrentItemForDetails();

const isShowingSearch = ref(false);
mitt.on('search:show', () => isShowingSearch.value = true);

const isNoteEmpty = computed(() => !route.params.note || route.params.note === BLANK_NOTE_NAME);

watch(isShowingSearch, async (search, _, onCleanup) => {
  const query = { ...route.query };

  // `undefined` and empty array removes param from query
  // `null` means that query param should be there but value should be empty
  // @ts-expect-error idk why it is not happy, but it works
  query.search = search ? null : undefined;

  onCleanup(
    on(window, 'popstate', () => isShowingSearch.value = false),
  );

  await navigateTo({ ...route, query });
});

useHead({
  title: () => isNoteEmpty.value
    ? ((route.params.folders && route.params.folders.at(-1)) || '')
    : (route.params.note as string),
  titleTemplate: (name) => {
    return name
      ? `${name} | ${user.value!.username} - Keycap`
      : `${user.value!.username} - Keycap`;
  },
});

useTinykeys({
  [shortcuts.edit]: (event) => {
    if (isNoteEmpty.value) {
      return;
    }

    event.preventDefault();
    withTiptapEditor((editor) => editor.commands.focus());
  },

  [shortcuts.search]: (event) => {
    event.preventDefault();

    if (currentItemForDetails.value) {
      currentItemForDetails.value = undefined;
    }

    isShowingSearch.value = !isShowingSearch.value;
  },
});

onMounted(() => {
  isShowingSearch.value = route.query.search !== undefined;

  prepareWorkspace();

  if (import.meta.dev) {
    // @ts-expect-error this should not be defined
    window.$createToast = useToaster();
  }
});
</script>

<template>
  <div id="workspace" class="workspace">
    <LazyWorkspaceBannerNoConnection v-if="isFallback" />

    <LazyWorkspaceToolbox />

    <WithFadeTransition>
      <LazyWorkspaceWelcome v-if="isNoteEmpty" />

      <main v-else class="workspace__note">
        <NuxtPage
          :transition="{ name: 'fade' }"
        />
      </main>
    </WithFadeTransition>

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
    --scrollbar-thumb-color: hsla(var(--text-color-hsl), 0.175);
    --scrollbar-background: hsla(var(--text-color-hsl), 0.025);

    flex: 1;

    width: 100%;
    height: 100%;

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
