<script setup lang="ts">
import { blankNoteName } from '~/assets/constants';

import type WorkspaceSearch from '~/components/workspace/Search/index.vue';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const user = useUser();

const search = ref<InstanceType<typeof WorkspaceSearch> | null>(null);

const isShowingContents = ref(false);
const isShowingSearch = ref(false);
const currentRouteName = computed(() => {
  const folders = route.params.folders;
  const currentFolder = Array.isArray(folders) ? folders.at(-1) : folders as string;

  if (currentFolder && (!route.params.folders || route.params.note === blankNoteName))
    return decodeURIComponent(currentFolder);

  if (route.params.note && route.params.note !== blankNoteName)
    return decodeURIComponent(route.params.note as string);

  return null;
});

useHead({
  title: () => currentRouteName.value,
  titleTemplate: (name) => {
    const username = user.value?.username;
    const title = name ? `${name} | ${username}` : username || '';

    return title ? `${title} - Keycap` : 'Keycap';
  },
});

useTinykeys({
  '$mod+Shift+k': (event) => {
    event.preventDefault();

    isShowingSearch.value = !isShowingSearch.value;
  },
});

watch(() => route.params.note, (noteName) => {
  const isEmptyNoteName = !noteName || noteName === blankNoteName;

  isShowingContents.value = isEmptyNoteName;
}, { immediate: true });

onMounted(() => {
  const preloadSearch = () => preloadComponents('WorkspaceSearch');

  if ('requestIdleCallback' in window)
    window.requestIdleCallback(preloadSearch);
  else
    setTimeout(preloadSearch, 500);
});
</script>

<template>
  <div class="workspace">
    <WorkspaceNavbar class="workspace__navbar" />

    <aside class="workspace__contents" :class="{ 'workspace__contents--visible': isShowingContents }">
      <WorkspaceContents />
    </aside>

    <Transition name="note-change">
      <PlaceholderBlankNote
        v-if="!route.params.note || $route.params.note === blankNoteName"
        key="blank-note"
        class="workspace__note"
      />

      <main v-else class="workspace__note">
        <NuxtPage />
      </main>
    </Transition>

    <!-- TODO: wrap search into teleport[to="body"] when pull request merged https://github.com/vuejs/core/pull/6548 -->
    <Transition
      name="search-fade"
      @after-enter="search?.input?.focus()"
    >
      <LazyWorkspaceSearch
        v-if="isShowingSearch"
        ref="search"
        @close="isShowingSearch = false"
      />
    </Transition>
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

    @media screen and (max-width: 740px) {
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

    ul {
      padding: 0;
      margin: 0;

      list-style-type: none;
    }

    @media screen and (max-width: 740px) {
      display: none;

      padding: 4.5rem 1rem 2rem;

      &--visible {
        display: block;

        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        max-width: none;

        border: none;
      }
    }
  }

  &__note {
    grid-row: 1 / end;
    grid-column: 2;

    overflow-y: auto;

    & > div {
      height: 100%;
    }

    @media screen and (max-width: 740px) {
      grid-area: 2 / 1;
    }
  }

  @media screen and (max-width: 740px) {
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  }
}

.note-change-enter-active {
  transition: opacity 0.25s * 2 ease;
}

.note-change-leave-active {
  display: none;
}

.note-change-enter-from,
.note-change-leave-to {
  opacity: 0;
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
