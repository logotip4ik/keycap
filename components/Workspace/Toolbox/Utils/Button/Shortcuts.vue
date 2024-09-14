<script setup lang="ts">
import { LazyIconBaselineKeyboardCommandKey } from '#components';

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
    <LazyIconBaselineKeyboardCommandKey class="toolbox__utils__item__btn__icon" />

    Shortcuts
  </button>
</template>
