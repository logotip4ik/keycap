<script setup lang="ts">
import {
  LazyWorkspaceToolboxUtilsButtonItemDetails,
  LazyWorkspaceToolboxUtilsButtonSearch,
  LazyWorkspaceToolboxUtilsButtonShortcuts,
} from '#components';

import { useToolboxState } from '../config';

const route = useRoute();
const { isSmallScreen } = useDevice();
const { state } = useToolboxState();

const utilsComp = useTemplateRef('utilsComp');

interface Util {
  id: number
  shouldShow?: ComputedRef<boolean>
  component: Component
};

const utils: Array<Util> = [
  {
    id: 1,
    component: LazyWorkspaceToolboxUtilsButtonSearch,
  },
  {
    id: 2,
    shouldShow: computed(() => !!route.params.note && route.params.note !== BLANK_NOTE_NAME),
    component: LazyWorkspaceToolboxUtilsButtonItemDetails,
  },
  {
    id: 3,
    component: LazyWorkspaceToolboxUtilsButtonShortcuts,
  },
];

const filteredUtils = computed(() => {
  return utils.filter((util) => !util.shouldShow || util.shouldShow.value === true);
});

let prevHeight: number;
function rememberHeight() {
  if (!utilsComp.value) {
    return;
  }

  stopAnimations(utilsComp.value.$el);

  prevHeight = utilsComp.value.$el.clientHeight;
}

function transitionHeight() {
  const currentHeight = utilsComp.value?.$el.clientHeight;

  utilsComp.value?.$el.animate([
    { height: `${prevHeight}px` },
    { height: `${currentHeight}px` },
  ], { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
}

function hideIfNeeded() {
  if (isSmallScreen.value && state.value === 'pinned') {
    state.value = 'hidden';
  }
}
</script>

<template>
  <WithListTransitionGroup
    ref="utilsComp"
    tag="ul"
    class="toolbox__utils"
    @enter="transitionHeight"
    @leave="transitionHeight"
    @before-enter="rememberHeight"
    @before-leave="rememberHeight"
  >
    <li
      v-for="util in filteredUtils"
      :key="util.id"
      class="toolbox__utils__item"
      @click="hideIfNeeded"
    >
      <Component :is="util.component" />
    </li>
  </WithListTransitionGroup>
</template>

<style lang="scss">
.toolbox__utils {
  position: relative;

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
      line-height: 1.5;
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
