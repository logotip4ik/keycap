<script setup lang="ts">
import type { WorkspaceSidebar } from '#components';

const sidebar = shallowRef<InstanceType<typeof WorkspaceSidebar>>();

const { shortcuts } = useAppConfig();
const { visibility: contentsVisibility } = useContentsSidebar();
const { visibility: toolboxVisibility } = useToolboxSidebar();

function updateState(newState: SidebarState) {
  contentsVisibility.value = newState;
}

function hideSidebarsIfNeeded() {
  const sidebar = shouldUnpinSidebar(contentsVisibility, toolboxVisibility);

  if (sidebar) {
    sidebar.value = 'hidden';
  }
}

function smartUpdateState(newState: SidebarState) {
  contentsVisibility.value = newState;

  hideSidebarsIfNeeded();
}

useTinykeys({
  [shortcuts.contents]: (e) => {
    e.preventDefault();

    smartUpdateState(
      contentsVisibility.value === 'hidden'
        ? 'visible'
        : 'hidden',
    );
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
    ref="sidebar"
    dir="right"
    name="contents"
    :state="contentsVisibility"
    @update-state="updateState"
  >
    <WorkspaceContentsHeader
      :state="contentsVisibility"
      @update-state="smartUpdateState"
    />

    <WorkspaceContentsCreateButton />

    <hr>

    <WorkspaceContentsList
      :state="contentsVisibility"
      @update-state="smartUpdateState"
    />
  </WorkspaceSidebar>
</template>
