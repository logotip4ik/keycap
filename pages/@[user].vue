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
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;

  height: calc(var(--1vh, 1vh) * 100);

  &__navbar {
    grid-column: 1 / end;

    border-bottom: 1px solid hsla(var(--text-color-hsl), 0.25);
  }

  &__contents {
    grid-area: 2 / 1;

    display: grid;
    grid-template-rows: 1fr auto;

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
      margin-left: 0.5rem;
    }
  }

  &__note {
    grid-area: 2 / 2;

    overflow: hidden;
  }
}
</style>
