<script setup lang="ts">

</script>

<template>
  <WorkspaceSidebar
    v-slot="{ state, updateState }"
    cookie-name="_contents-state"
    dir="right"
    class="contents"
  >
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
