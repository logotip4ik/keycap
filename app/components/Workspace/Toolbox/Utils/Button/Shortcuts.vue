<script setup lang="ts">
const mitt = useMitt();

function openShortcuts() {
  mitt.emit('shortcuts:show');
}
</script>

<template>
  <button
    class="toolbox__utils__item__btn"
    aria-label="open shortcuts"
    @click="openShortcuts"
  >
    <Icon name="baseline-keyboard-command-key" class="toolbox__utils__item__btn__icon" />

    Shortcuts
  </button>
</template>
