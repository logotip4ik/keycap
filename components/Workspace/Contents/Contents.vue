<script setup lang="ts">
import { ContentsState } from './config';

const { shortcuts } = useAppConfig();
const { state } = useContentsSidebar();
const { state: toolboxState } = useToolboxSidebar();

const isFixed = ref(false);
let lastNonFixedState: SidebarState | undefined;

const contentsState = computed<SidebarState>({
  get: () => state.value,
  set: (value) => {
    if (isFixed.value) {
      lastNonFixedState = value;
      return;
    }

    state.value = value;

    hideSidebarsIfNeeded();
  },
});

watch(isFixed, (isFixed) => {
  if (!isFixed && lastNonFixedState) {
    contentsState.value = lastNonFixedState;
    lastNonFixedState = undefined;
  }
});

provide(ContentsState, { state: contentsState, isFixed });

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
