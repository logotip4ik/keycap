<script setup lang="ts">
import { ToolboxState } from './config';

const user = useRequiredUser();
</script>

<template>
  <header class="toolbox__header">
    <WorkspaceSidebarOpenButton :injection-key="ToolboxState" aria-label="open toolbox sidebar">
      <Icon name="menu-rounded" class="toolbox__header__svg" />
    </WorkspaceSidebarOpenButton>

    <p class="toolbox__header__username font-wide">
      {{ user.username }}
    </p>
  </header>
</template>

<style lang="scss">
.toolbox__header {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &__username {
    font-size: calc(1rem + 0.25vw);
    color: hsla(var(--text-color-hsl), 0.875);
    text-overflow: ellipsis;
    white-space: nowrap;

    margin: 0 0 0 var(--pd-x);
    padding: 0;

    overflow: hidden;
  }

  &__svg {
    width: 70% !important;
  }
}
</style>
