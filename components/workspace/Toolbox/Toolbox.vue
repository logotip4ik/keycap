<script setup lang="ts">
import { debounce } from 'perfect-debounce';

import type SidebarVue from '../Sidebar/Sidebar.vue';
import type { SidebarState } from '~/composables/sidebars';

const sidebar = shallowRef<InstanceType<typeof SidebarVue>>();

const { shortcuts } = useAppConfig();
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
  name: 'toolbox',
  class: 'toolbox',
  state: toolboxState,
  onUpdateState: updateState,
};

if (import.meta.client) {
  let prevWindowWidth = window.innerWidth;

  onBeforeUnmount(
    on(window, 'resize', debounce(() => {
      if (prevWindowWidth !== window.innerWidth)
        return hideSidebarsIfNeeded();

      prevWindowWidth = window.innerWidth;
    }, 225)), // intentionally larger debounce time to hide toolbox first
  );
};

let prevFocusedEl: HTMLElement | undefined;
useTinykeys({
  [shortcuts.toolbox]: (e) => {
    e.preventDefault();

    const nextState: SidebarState = toolboxState.value === 'hidden' ? 'visible' : 'hidden';

    smartUpdateState(nextState);

    if (nextState === 'visible') {
      prevFocusedEl = document.activeElement as HTMLElement;

      nextTick(() => sidebar.value?.el?.focus());
    }
    else {
      prevFocusedEl?.focus();
    }
  },
});
</script>

<template>
  <WorkspaceSidebar v-bind="data" ref="sidebar">
    <!-- TODO: add fade ? animation when entering. Something like iphone quick settings menu -->
    <WorkspaceToolboxHeader
      :state="toolboxState"
      @update-state="smartUpdateState"
    />

    <WorkspaceToolboxUtils />

    <hr>

    <WorkspaceToolboxRecent
      :state="toolboxState"
      @update-state="smartUpdateState"
    />

    <WorkspaceToolboxFooter />
  </WorkspaceSidebar>
</template>

<style lang="scss">
@media (width > $sidebar-breakpoint-one) {
  .toolbox {
    width: calc(var(--sidebar-width) - var(--mr-x));
  }
}
</style>
