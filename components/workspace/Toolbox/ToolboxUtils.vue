<script setup lang="ts">
import { LazyIconInfoOutline, LazyIconSearchRounded } from '#components';

const detailsItem = useCurrentItemForDetails();

const utils = [
  {
    text: 'Open Search',
    label: 'open quick search',
    icon: LazyIconSearchRounded,
    action: () => {
      useMitt().emit('search:show');
    },
  },
  {
    text: 'Show Item Details',
    label: 'open item details popup',
    icon: LazyIconInfoOutline,
    buttonAttrs: {
      ariaHaspopup: 'dialog',
      ariaControls: 'item-details',
      ariaLabel: 'current note details',
      ariaExpanded: !!detailsItem.value,
    },
    action: () => {
      useMitt().emit('details:show');
    },
  },
];
</script>

<template>
  <ul class="toolbox__utils">
    <li
      v-for="(util, idx) in utils"
      :key="idx"
      class="toolbox__utils__item"
    >
      <button
        v-bind="util.buttonAttrs"
        :aria-label="util.label"
        class="toolbox__utils__item__btn"
        @click="util.action"
      >
        <component :is="util.icon" class="toolbox__utils__item__btn__icon" />

        {{ util.text }}
      </button>
    </li>
  </ul>
</template>

<style lang="scss">
.toolbox__utils {
  margin: var(--pd-y) 0 calc(var(--pd-y) / 2);
  padding: 0;

  list-style-type: none;

  &__item {
    &:not(:first-child) {
      margin-top: calc(var(--pd-y) / 5);
    }

    &__btn {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      text-align: start;
      color: hsla(var(--text-color-hsl), 0.65);

      width: 100%;

      padding: calc(var(--pd-y) * 0.75) calc(var(--pd-x) * 0.66);

      border: none;
      border-radius: 0.225rem;
      appearance: none;
      background-color: transparent;

      cursor: pointer;
      transition: background-color 0.1s, color 0.1s;

      @media (width <= $sidebar-breakpoint-one) {
        --pd-y: 1.25rem;
      }

      &:is(:hover, :focus-visible) {
        background-color: hsla(var(--text-color-hsl), 0.05);

        color: hsla(var(--text-color-hsl), 0.9);

        svg {
          color: hsla(var(--text-color-hsl), 0.9);
        }
      }

      &__icon {
        color: hsla(var(--text-color-hsl), 0.5);

        width: 1.25rem;
        height: auto;

        margin-right: calc(var(--pd-x) * 0.5);

        transition: color 0.1s;
      }
    }
  }
}
</style>
