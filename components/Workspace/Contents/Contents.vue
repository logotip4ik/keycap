<script setup lang="ts">
import { ContentsState } from './config';

const { shortcuts } = useAppConfig();
const { state } = useContentsSidebar();
const { state: toolboxState } = useToolboxSidebar();

const contentsState = computed<SidebarState>({
  get: () => state.value,
  set: (value) => {
    state.value = value;

    hideSidebarsIfNeeded();
  },
});

provide(ContentsState, { state: contentsState });

function hideSidebarsIfNeeded() {
  const sidebar = shouldUnpinSidebar(contentsState, toolboxState);

  if (sidebar) {
    sidebar.value = 'hidden';
  }
}

useTinykeys({
  [shortcuts.contents]: (e) => {
    e.preventDefault();

    contentsState.value = contentsState.value === 'hidden'
      ? 'visible'
      : 'hidden';
  },
});

if (import.meta.client) {
  let prevWindowWidth = window.innerWidth;

  onBeforeUnmount(
    on(window, 'resize', debounce(() => {
      if (prevWindowWidth !== window.innerWidth) {
        return hideSidebarsIfNeeded();
      }

      prevWindowWidth = window.innerWidth;
    }, 200)),
  );
}
</script>

<template>
  <WorkspaceSidebar
    dir="right"
    name="contents"
    :injection-key="ContentsState"
  >
    <WorkspaceContentsHeader />

    <WorkspaceContentsCreateButton />

    <hr>

    <WorkspaceContentsList />
  </WorkspaceSidebar>
</template>
