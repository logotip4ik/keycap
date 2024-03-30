<script setup lang="ts">
import type { WorkspaceSidebar } from '#components';

const sidebar = shallowRef<InstanceType<typeof WorkspaceSidebar>>();

const { shortcuts } = useAppConfig();
const { visibility: toolboxVisibility } = useToolboxSidebar();
const { visibility: contentsVisibility } = useContentsSidebar();

function updateState(newState: SidebarState) {
  toolboxVisibility.value = newState;
}

function hideSidebarsIfNeeded() {
  const sidebar = shouldUnpinSidebar(toolboxVisibility, contentsVisibility);

  if (sidebar)
    sidebar.value = 'hidden';
}

function smartUpdateState(newState: SidebarState) {
  toolboxVisibility.value = newState;

  hideSidebarsIfNeeded();
}

useTinykeys({
  [shortcuts.toolbox]: (e) => {
    e.preventDefault();

    smartUpdateState(
      toolboxVisibility.value === 'hidden'
        ? 'visible'
        : 'hidden',
    );
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
    :state="toolboxVisibility"
    @update-state="updateState"
  >
    <!-- TODO: add fade ? animation when entering. Something like iphone quick settings menu -->
    <WorkspaceToolboxHeader
      :state="toolboxVisibility"
      @update-state="smartUpdateState"
    />

    <WorkspaceToolboxUtils
      :state="toolboxVisibility"
      @update-state="smartUpdateState"
    />

    <hr>

    <WorkspaceToolboxRecent
      :state="toolboxVisibility"
      @update-state="smartUpdateState"
    />

    <WorkspaceToolboxFooter />
  </WorkspaceSidebar>
</template>
