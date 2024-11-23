<script setup lang="ts">
import type { WorkspaceSidebar as Sidebar } from '#components';

import { ToolboxState } from './config';

const { shortcuts } = useAppConfig();
const { state } = useToolboxSidebar();
const { state: contentsState } = useContentsSidebar();

const sidebar = shallowRef<InstanceType<typeof Sidebar> | null>(null);

const toolboxState = computed<SidebarState>({
  get: () => state.value,
  set: (value) => {
    state.value = value;

    hideSidebarsIfNeeded();
  },
});

provide(ToolboxState, { state: toolboxState });

function hideSidebarsIfNeeded() {
  const sidebar = shouldUnpinSidebar(toolboxState, contentsState);

  if (sidebar) {
    sidebar.value = 'hidden';
  }
}

useTinykeys({
  [shortcuts.toolbox]: (e) => {
    e.preventDefault();

    toolboxState.value = toolboxState.value === 'hidden'
      ? 'visible'
      : 'hidden';

    nextTick(() => {
      sidebar.value?.el?.focus();
    });
  },
});

if (import.meta.client) {
  let prevWindowWidth = window.innerWidth;

  onBeforeUnmount(
    on(window, 'resize', debounce(() => {
      if (prevWindowWidth !== window.innerWidth) {
        hideSidebarsIfNeeded();
      }

      prevWindowWidth = window.innerWidth;
    }, 225)), // intentionally larger debounce time to hide toolbox first
  );
};
</script>

<template>
  <WorkspaceSidebar
    ref="sidebar"
    name="toolbox"
    :injection-key="ToolboxState"
  >
    <WorkspaceToolboxHeader />

    <WorkspaceToolboxUtils />

    <hr>

    <WorkspaceToolboxRecent />

    <WorkspaceToolboxSettings />

    <hr>

    <WorkspaceToolboxFooter />
  </WorkspaceSidebar>
</template>

<style lang="scss">
.toolbox__section {
  &__title {
    font-size: 1.15rem;
    font-stretch: 105%;
    color: hsla(var(--text-color-hsl), 0.875);

    margin: calc(var(--pd-y) * 0.75) 0 var(--pd-y);
  }

  &__list {
    --spacing: calc(var(--pd-y) * 0.66);

    margin: var(--spacing) 0 0;
    padding: 0 0 0 calc(var(--pd-x) * 1.66);

    list-style-type: disc;

    &__item {
      color: hsla(var(--text-color-hsl), 0.75);

      transition: color .3s;

      &::marker {
        color: currentColor;
      }

      &:hover {
        color: var(--text-color);

        transition-duration: .1s;
      }

      &:not(:first-child) {
        margin-top: var(--spacing);
      }
    }
  }
}
</style>
