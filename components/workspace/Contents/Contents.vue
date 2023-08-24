<script setup lang="ts">
import type { SidebarState } from '~/composables/sidebars';

const name = '_contents';
const state = makeSidebarState(name);

function updateState(newState: SidebarState) {
  state.value = newState;
}

// otherwise volar is yelling that state is not ref :(
const data = {
  dir: 'right' as const,
  name,
  state,
  class: 'contents',
  onUpdateState: updateState,
};
</script>

<template>
  <WorkspaceSidebar v-bind="data">
    <WorkspaceContentsHeader
      :state="state"
      @update-state="updateState"
    />
  </WorkspaceSidebar>
</template>

<style lang="scss">
.contents {
  width: calc(var(--sidebar-width) - var(--mr-x) * 2);
}
</style>
