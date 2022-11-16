<script setup lang="ts">
const folder = useRootFolderContents();
</script>

<template>
  <template v-if="folder">
    <WorkspaceFolder :folder="folder" />
  </template>
</template>
