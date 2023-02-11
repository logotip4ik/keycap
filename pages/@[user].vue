<script setup lang="ts">
import { blankNoteName } from '~/assets/constants';
import breakpoints from '~/assets/constants/breakpoints';

import type WorkspaceSearch from '~/components/workspace/Search/index.vue';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const user = useUser();
const { width: windowWidth } = useWindowSize();
const { isMobileOrTablet } = useDevice();
const { shortcuts } = useAppConfig();

const currentNoteState = useCurrentNoteState();

const search = ref<InstanceType<typeof WorkspaceSearch> | null>(null);

const isShowingSearch = ref(false);
const isShowingContents = computed(() => {
  const noteName = route.params.note;

  const isNoteNameEmpty = !noteName || noteName === blankNoteName;

  if (process.server) {
    if (isMobileOrTablet) return isNoteNameEmpty;

    return true;
  }

  if (windowWidth.value < breakpoints.tablet)
    return isNoteNameEmpty;

  return true;
});

const currentRouteName = computed(() => {
  const folders = route.params.folders;
  const currentFolder = Array.isArray(folders) ? folders.at(-1) : folders as string;

  if (currentFolder && (!route.params.folders || route.params.note === blankNoteName))
    return decodeURIComponent(currentFolder);

  if (route.params.note && route.params.note !== blankNoteName)
    return decodeURIComponent(route.params.note as string);

  return null;
});

watch(() => route.params.note, (noteName) => {
  const isEmptyNoteName = !noteName || noteName === blankNoteName;

  if (isEmptyNoteName) currentNoteState.value = '';
});

useHead({
  title: () => currentRouteName.value,
  titleTemplate: (name) => {
    const username = user.value?.username;
    const title = name ? `${name} | ${username}` : (username || '');

    return title ? `${title} - Keycap` : 'Keycap';
  },
});

useTinykeys({
  [shortcuts.search]: (event) => {
    event.preventDefault();

    isShowingSearch.value = !isShowingSearch.value;
  },
});

onMounted(() => {
  // request idle callback is polyfilled by nuxt
  const idleCallback = window.requestIdleCallback;

  const callbacks = [preloadDashboardComponents, defineFuzzyWorker, defineOfflineStorage];

  idleCallback(
    // calls functions in idle waterfall
    callbacks.reduce((acc, fn) => () => {
      acc();
      idleCallback(fn);
    }),
  );
});
</script>

<template>
  <div class="workspace">
    <WorkspaceNavbar
      class="workspace__navbar"
      @open-search="isShowingSearch = true"
    />

    <Transition name="fade">
      <aside
        v-show="isShowingContents"
        class="workspace__contents"
      >
        <WorkspaceContents />
      </aside>
    </Transition>

    <Transition name="fade">
      <WorkspaceFab
        v-show="isShowingContents"
        @open-search="isShowingSearch = true"
      />
    </Transition>

    <Transition name="fade">
      <WorkspaceWelcome
        v-if="!route.params.note || $route.params.note === blankNoteName"
        key="blank-note"
        class="workspace__note"
      />

      <main v-else class="workspace__note">
        <NuxtPage />
      </main>
    </Transition>

    <Teleport to="body">
      <Transition
        name="search-fade"
        @after-enter="search?.input?.$el?.focus()"
      >
        <LazyWorkspaceSearch
          v-if="isShowingSearch"
          ref="search"
          @close="isShowingSearch = false"
        />
      </Transition>
    </Teleport>

    <Teleport to="body">
      <WorkspaceToasts />
    </Teleport>
  </div>
</template>

<style lang="scss">
.workspace {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;

  height: calc(var(--1vh, 1vh) * 100);

  &__navbar {
    grid-column: 1 / 1;

    border-right: 1px solid hsla(var(--text-color-hsl), 0.25);
    border-bottom: 1px solid hsla(var(--text-color-hsl), 0.25);

    @media screen and (max-width: $breakpoint-tablet) {
      grid-area: 1 / 1;

      border-right: none
    }
  }

  &__contents {
    grid-area: 2 / 1;

    position: relative;
    z-index: 1;
    isolation: isolate;

    height: 100%;
    width: 20vw;

    max-width: 250px;
    min-width: 125px;

    margin: 0;
    padding: 0;

    border-right: 1px solid hsla(var(--text-color-hsl), 0.25);

    &__list {
      padding: 0;
      margin: 0;

      list-style-type: none;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      max-width: 100%;

      padding: 4.5rem 1rem 2rem;
    }
  }

  &__note {
    grid-row: 1 / end;
    grid-column: 2;

    overflow-y: auto;

    &:not(.welcome) > div {
      height: 100%;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      grid-area: 2 / 1;
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  }
}

.search-fade-leave-active,
.search-fade-leave-active .search {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.search-fade-enter-active {
  display: none;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;

  .search {
    transform: scale(0.95);
  }
}
</style>
