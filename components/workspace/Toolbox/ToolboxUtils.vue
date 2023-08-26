<script setup lang="ts">
import { LazyIconSearchRounded } from '#components';

const utils = [
  {
    text: 'Open Search',
    label: 'open quick search',
    icon: LazyIconSearchRounded,
    action: () => {
      useMitt().emit('search:show');
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
  margin: 1.5rem 0 0;
  padding: 0;

  list-style-type: none;

  &__item {
    &__btn {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      font-size: 1.175rem;
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

      &:not(:first-child) {
        margin-top: calc(var(--pd-y) / 5);
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

        width: 1.5rem;
        height: auto;

        margin-right: calc(var(--pd-x) * 0.5);

        transition: color 0.1s;
      }
    }
  }
}
</style>
