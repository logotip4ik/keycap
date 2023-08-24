<script setup lang="ts">
import type { SidebarState } from '~/composables/sidebars';

const name = '_toolbox';
const state = makeSidebarState(name);

function updateState(newState: SidebarState) {
  state.value = newState;
}

// otherwise volar is yelling that state is not ref :(
const data = {
  name,
  state,
  onUpdateState: updateState,
};
</script>

<template>
  <WorkspaceSidebar v-bind="data">
    <!-- TODO: add fade ? animation when entering. Something like iphone quick settings menu -->
    <WorkspaceToolboxHeader
      :state="state"
      @update-state="updateState"
    />

    <WorkspaceToolboxUtils />

    <WorkspaceToolboxFooter />
  </WorkspaceSidebar>
</template>
