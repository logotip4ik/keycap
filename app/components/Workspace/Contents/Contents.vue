<script setup lang="ts">
import { ContentsState } from './config';

const { shortcuts } = useAppConfig();
const { state } = useContentsSidebar();
const { state: toolboxState } = useToolboxSidebar();

const sidebar = useTemplateRef('sidebar');
const isFixed = ref(false);
const ariaKeyshortcuts = useAriaKeyshortcuts(shortcuts.contents);

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
    }, 200)),
  );
}
</script>

<template>
  <WorkspaceSidebar
    ref="sidebar"
    dir="right"
    name="contents"
    :injection-key="ContentsState"
    aria-labelledby="contents-header"
    :aria-keyshortcuts
  >
    <WorkspaceContentsHeader />

    <WorkspaceContentsCreateButton />

    <hr>

    <WorkspaceContentsList />
  </WorkspaceSidebar>
</template>
