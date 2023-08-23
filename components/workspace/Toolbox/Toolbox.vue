<script setup lang="ts">
</script>

<template>
  <WorkspaceSidebar
    v-slot="{ state, updateState }"
    cookie-name="_toolbox-state"
  >
    <!-- TODO: add fade ? animation when entering. Something like iphone quick settings menu -->
    <WorkspaceToolboxHeader
      :state="state"
      @update-state="updateState"
    />

    <WorkspaceToolboxUtils />

    <WorkspaceToolboxFooter />
  </WorkspaceSidebar>
</template>
