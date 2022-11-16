<script setup lang="ts">
import type { FolderWithContents } from '~~/composables/store';

definePageMeta({
  middleware: ['auth'],
});

const rootFolderContents = useRootFolderContents();
const currentFolder = ref<{ name: string; path: string; notes?: [] }>({ name: '', path: '/' });

const { data: contents } = useLazyFetch<FolderWithContents>(
  () => `/api/folder${currentFolder.value.path}`,
  { server: false },
);

watch(contents, (newContents) => {
  if (!newContents) return;

  rootFolderContents.value = newContents;
});
</script>

<template>
  <div class="workspace">
    <WorkspaceNavbar class="workspace__navbar" />

    <aside class="workspace__contents">
      <WorkspaceContents />
    </aside>

    <main class="workspace__note">
      <NuxtPage />
    </main>
  </div>
</template>

<style lang="scss">
.workspace {
  display: grid;
  grid-template-columns: 0.25fr 1fr;
  grid-template-rows: auto 1fr;

  height: calc(var(--1vh, 1vh) * 100);

  &__navbar {
    grid-column: 1 / end;
  }

  &__contents {
    grid-area: 2 / 1;

    height: 100%;

    margin: 0;
    padding: 0;

    border-right: 1px solid var(--text-color);

    ul {
      padding: 0 0.25rem;

      margin-left: 0.25rem;
    }
  }

  &__note {
    grid-area: 2 / 2;
  }
}
</style>
