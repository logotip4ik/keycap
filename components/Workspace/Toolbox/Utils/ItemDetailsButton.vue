<script setup lang="ts">
const mitt = useMitt();
const detailsItem = useCurrentItemForDetails()!;

function openDetails() {
  mitt.emit('details:show');
}
</script>

<template>
  <button
    class="toolbox__utils__item__btn"
    aria-label="open item details popup"
    aria-haspopup="dialog"
    aria-controls="item-details"
    :aria-expanded="!!detailsItem"
    @click="openDetails"
  >
    <LazyIconInfoOutline class="toolbox__utils__item__btn__icon" />

    Show Item Details
  </button>
</template>
