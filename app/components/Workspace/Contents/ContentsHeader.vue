<script setup lang="ts">
import { ContentsState } from './config';
</script>

<template>
  <header class="contents__header">
    <WorkspaceContentsHeaderCrumbs />

    <WorkspaceSidebarOpenButton :injection-key="ContentsState">
      <LazyIconOutlineFolder />
    </WorkspaceSidebarOpenButton>
  </header>
</template>

<style lang="scss">
.contents__header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  flex-wrap: nowrap;
}
</style>
