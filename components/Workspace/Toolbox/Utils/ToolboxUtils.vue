<script setup lang="ts">
import {
  LazyWorkspaceToolboxUtilsButtonItemDetails,
  LazyWorkspaceToolboxUtilsButtonSearch,
} from '#components';

const props = defineProps<{
  state: SidebarState
  onUpdateState: (newState: SidebarState) => void
}>();

const route = useRoute();
const { isSmallScreen } = useDevice();
const utilsEl = shallowRef<ComponentPublicInstance<HTMLUListElement> | null>(null);

interface Util {
  shouldShow?: ComputedRef<boolean>
  component: Component
};

const utils: Array<Util> = [
  {
    component: LazyWorkspaceToolboxUtilsButtonSearch,
  },
  {
    shouldShow: computed(() => !!route.params.note && route.params.note !== BLANK_NOTE_NAME),
    component: LazyWorkspaceToolboxUtilsButtonItemDetails,
  },
];

let prevHeight: number;
function rememberHeight() {
  if (!utilsEl.value) {
    return;
  }

  prevHeight = utilsEl.value.$el.clientHeight;
}

function transitionHeight() {
  const currentHeight = utilsEl.value?.$el.clientHeight;

  utilsEl.value?.$el.animate([
    { height: `${prevHeight}px` },
    { height: `${currentHeight}px` },
  ], { duration: 375, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
}

function hideIfNeeded() {
  if (isSmallScreen.value && props.state === 'pinned') {
    props.onUpdateState('hidden');
  }
}
</script>

<template>
  <TransitionGroup
    ref="utilsEl"
    tag="ul"
    name="fade"
    class="toolbox__utils"
    @enter="transitionHeight"
    @leave="transitionHeight"
    @before-enter="rememberHeight"
    @before-leave="rememberHeight"
  >
    <li
      v-for="(util, idx) in utils"
      v-show="unref(util.shouldShow) ?? true"
      :key="idx"
      class="toolbox__utils__item"
      @click="hideIfNeeded"
    >
      <Component :is="util.component" />
    </li>
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
