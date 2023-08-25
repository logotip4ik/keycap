<script setup lang="ts">
import { debounce } from 'perfect-debounce';

import type { SidebarState } from '~/composables/sidebars';

const contentsState = useContentsSidebarState();
const toolboxState = useToolboxSidebarState();

function updateState(newState: SidebarState) {
  contentsState.value = newState;
}

function hideSidebarsIfNeeded() {
  const sidebar = shouldUnpinSidebar(contentsState, toolboxState);

  if (sidebar)
    sidebar.value = 'hidden';
}

// TODO: hoist this function and use in contents as well as here ?
function smartUpdateState(newState: SidebarState) {
  contentsState.value = newState;

  hideSidebarsIfNeeded();
}

// otherwise volar is yelling that state is not ref :(
const data = {
  dir: 'right' as const,
  name: 'contents',
  state: contentsState,
  onUpdateState: updateState,
};

if (!import.meta.env.SSR) {
  onBeforeUnmount(
    on(window, 'resize', debounce(hideSidebarsIfNeeded, 200)),
  );
}
</script>

<template>
  <WorkspaceSidebar v-bind="data">
    <WorkspaceContentsHeader
      :state="contentsState"
      @update-state="smartUpdateState"
    />

    <!-- TODO: add button for creating new item -->
    <!-- TODO: add button for going up folder if current folder is not root ? -->

    <WorkspaceContentsList
      :state="contentsState"
    />
  </WorkspaceSidebar>
</template>
