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

if (import.meta.client) {
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

    <WorkspaceContentsCreateBtn />

    <hr>

    <WorkspaceContentsList
      :state="contentsState"
    />
  </WorkspaceSidebar>
</template>
