<script setup lang="ts">
import type SidebarVue from '../Sidebar/Sidebar.vue';

const { shortcuts } = useAppConfig();
const toolboxState = useToolboxSidebarState();
const contentsState = useContentsSidebarState();

const sidebar = shallowRef<InstanceType<typeof SidebarVue>>();

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

useTinykeys({
  [shortcuts.toolbox]: (e) => {
    e.preventDefault();

    const nextState: SidebarState = toolboxState.value === 'hidden' ? 'visible' : 'hidden';

    smartUpdateState(nextState);
  },
});

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
</script>

<template>
  <WorkspaceSidebar
    ref="sidebar"
    name="toolbox"
    class="toolbox"
    :state="toolboxState"
    @update-state="updateState"
  >
    <!-- TODO: add fade ? animation when entering. Something like iphone quick settings menu -->
    <WorkspaceToolboxHeader
      :state="toolboxState"
      @update-state="smartUpdateState"
    />

    <WorkspaceToolboxUtils
      :state="toolboxState"
      @update-state="smartUpdateState"
    />

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
