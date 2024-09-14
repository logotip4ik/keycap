<script setup lang="ts">
import { SearchAction } from '~/types/common';

const detailsItem = useCurrentItemForDetails();

function openDetails() {
  commandActions[SearchAction.Details]();
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
