<script setup lang="ts">
const { shortcuts } = useAppConfig();
const { visibility: toolboxVisibility } = useToolboxSidebar();
const { visibility: contentsVisibility } = useContentsSidebar();

function updateState(newState: SidebarState) {
  toolboxVisibility.value = newState;
}

function hideSidebarsIfNeeded() {
  const sidebar = shouldUnpinSidebar(toolboxVisibility, contentsVisibility);

  if (sidebar) {
    sidebar.value = 'hidden';
  }
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
      if (prevWindowWidth !== window.innerWidth) {
        return hideSidebarsIfNeeded();
      }

      prevWindowWidth = window.innerWidth;
    }, 225)), // intentionally larger debounce time to hide toolbox first
  );
};
</script>

<template>
  <WorkspaceSidebar
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

      transition: color .3s, filter .3s;

      &::marker {
        color: currentColor;
      }

      &:hover {
        color: var(--text-color);
        filter: drop-shadow(0 0 0.5rem hsla(var(--text-color-hsl), 0.35));

        transition-duration: .1s;
      }

      &:not(:first-child) {
        margin-top: var(--spacing);
      }
    }
  }
}
</style>
