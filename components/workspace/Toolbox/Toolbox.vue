<script setup lang="ts">
import { debounce } from 'perfect-debounce';

import type { SidebarState } from '~/composables/sidebars';

const name = 'toolbox';
const toolboxState = useToolboxSidebarState();
const contentsState = useContentsSidebarState();

function updateState(newState: SidebarState) {
  toolboxState.value = newState;
}

function hideSidebarsIfNeeded() {
  const sidebar = shouldUnpinSidebar(toolboxState, contentsState);

  if (sidebar)
    sidebar.value = 'hidden';
}

function smartUpdateState(newState: SidebarState) {
  toolboxState.value = newState;

  hideSidebarsIfNeeded();
}

// otherwise volar is yelling that state is not ref :(
const data = {
  name,
  class: 'toolbox',
  state: toolboxState,
  onUpdateState: updateState,
};

if (!import.meta.env.SSR) {
  onBeforeUnmount(
    on(window, 'resize', debounce(hideSidebarsIfNeeded, 225)), // intentionally larger debounce time to hide toolbox first
  );
};
</script>

<template>
  <WorkspaceSidebar v-bind="data">
    <!-- TODO: add fade ? animation when entering. Something like iphone quick settings menu -->
    <WorkspaceToolboxHeader
      :state="toolboxState"
      @update-state="smartUpdateState"
    />

    <WorkspaceToolboxUtils />

    <WorkspaceToolboxFooter />
  </WorkspaceSidebar>
</template>

<style lang="scss">
.toolbox {
  width: calc(var(--sidebar-width) - var(--mr-x));
}
</style>
