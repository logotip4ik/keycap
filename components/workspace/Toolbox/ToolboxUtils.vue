<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { LazyIconInfoOutline, LazyIconSearchRounded } from '#components';

const route = useRoute();
const detailsItem = useCurrentItemForDetails();
const utilsEl = shallowRef<ComponentPublicInstance<HTMLUListElement> | null>(null);

interface Util {
  shouldShow?: ComputedRef<boolean>
  text: string
  label: string
  icon: any
  ariaHaspopup?: HTMLAttributes['aria-haspopup'] | ComputedRef<HTMLAttributes['aria-haspopup']>
  ariaControls?: HTMLAttributes['aria-controls'] | ComputedRef<HTMLAttributes['aria-controls']>
  ariaExpanded?: HTMLAttributes['aria-expanded'] | ComputedRef<HTMLAttributes['aria-expanded']>
  action: () => any
}

const utils: Array<Util> = [
  {
    text: 'Open Search',
    label: 'open quick search',
    icon: LazyIconSearchRounded,
    action: () => {
      useMitt().emit('search:show');
    },
  },
  {
    shouldShow: computed(() => !!route.params.note && route.params.note !== BLANK_NOTE_NAME),
    text: 'Show Item Details',
    label: 'open item details popup',
    icon: LazyIconInfoOutline,
    action: () => {
      useMitt().emit('details:show');
    },

    ariaHaspopup: 'dialog',
    ariaControls: 'item-details',
    ariaExpanded: computed(() => !!detailsItem.value),
  },
];

let prevHeight: number;
function rememberHeight() {
  if (!utilsEl.value)
    return;

  prevHeight = utilsEl.value.$el.clientHeight;
}

function transitionHeight() {
  const currentHeight = utilsEl.value?.$el.clientHeight;

  utilsEl.value?.$el.animate([
    { height: `${prevHeight}px` },
    { height: `${currentHeight}px` },
  ], { duration: 375, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
}
</script>

<template>
  <TransitionGroup
    ref="utilsEl"
    tag="ul"
    name="list"
    class="toolbox__utils"
    @enter="transitionHeight"
    @leave="transitionHeight"
    @before-enter="rememberHeight"
    @before-leave="rememberHeight"
  >
    <template
      v-for="(util, idx) in utils"
      :key="idx"
    >
      <li
        v-if="unref(util.shouldShow) ?? true"
        class="toolbox__utils__item"
      >
        <button
          class="toolbox__utils__item__btn"
          :aria-label="util.label"
          :aria-haspopup="unref(util.ariaHaspopup)"
          :aria-controls="unref(util.ariaControls)"
          :aria-expanded="unref(util.ariaExpanded)"
          @click="util.action"
        >
          <component :is="util.icon" class="toolbox__utils__item__btn__icon" />

          {{ util.text }}
        </button>
      </li>
    </template>
  </TransitionGroup>
</template>

<style lang="scss">
.toolbox__utils {
  margin: var(--pd-y) 0 calc(var(--pd-y) / 2);
  padding: 0;

  will-change: height, contents;
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

        &:focus-visible {
          outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.75);
        }

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
