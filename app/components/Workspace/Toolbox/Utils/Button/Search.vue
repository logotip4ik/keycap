<script setup lang="ts">
const mitt = useMitt();

function openSearch() {
  mitt.emit('search:show');
}
</script>

<template>
  <button
    class="toolbox__utils__item__btn"
    aria-haspopup="true"
    aria-controls="search-modal"
    aria-label="open quick search"
    @click="openSearch"
  >
    <Icon name="search-rounded" class="toolbox__utils__item__btn__icon" />

    Open Search
  </button>
</template>
