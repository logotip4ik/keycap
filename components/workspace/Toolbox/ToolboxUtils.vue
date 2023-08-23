<script setup lang="ts">
import { LazyIconSearchRounded } from '#components';

const utils = [
  {
    text: 'Search',
    label: 'open quick search',
    icon: LazyIconSearchRounded,
    action: () => {
      useMitt().emit('search:show');
    },
  },
];
</script>

<template>
  <ul class="sidebar__utils">
    <li
      v-for="(util, idx) in utils"
      :key="idx"
      class="sidebar__utils__item"
    >
      <button
        :aria-label="util.label"
        class="sidebar__utils__item__btn"
        @click="util.action"
      >
        <component :is="util.icon" class="sidebar__utils__item__btn__icon" />

        {{ util.text }}
      </button>
    </li>
  </ul>
</template>

<style lang="scss">
.sidebar {
  &__utils {
    margin: 1.5rem 0 0;
    padding: 0;

    list-style-type: none;

    &__item {
      &__btn {
        --ff-size: calc(0.95rem + 0.25vw);

        display: flex;
        justify-content: flex-start;
        align-items: center;

        font-size: var(--ff-size);
        text-align: start;
        color: hsla(var(--text-color-hsl), 0.65);

        width: 100%;

        padding: calc(var(--pd-y) * 0.66) calc(var(--pd-x) * 0.66);

        border: none;
        border-radius: 0.225rem;
        appearance: none;
        background-color: transparent;

        cursor: pointer;
        transition: background-color 0.1s, color 0.1s;

        &:is(:hover, :focus-visible) {
          background-color: hsla(var(--text-color-hsl), 0.05);

          color: hsla(var(--text-color-hsl), 0.9);

          svg {
            color: hsla(var(--text-color-hsl), 0.9);
          }
        }

        &__icon {
          color: hsla(var(--text-color-hsl), 0.5);

          width: calc(var(--ff-size) * 1.33);
          height: auto;

          margin-right: calc(var(--pd-x) * 0.5);

          transition: color 0.1s;
        }
      }
    }
  }
}
</style>
