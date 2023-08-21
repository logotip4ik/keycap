<script setup lang="ts">
import type { Component } from 'vue';
import { LazyIconOutlineAdd, LazyIconSearchRounded } from '#components';

interface Props {
  onOpenSearch: () => void
}
const props = defineProps<Props>();

const isFabUnfolded = ref(false);
const fabContainer = ref<null | HTMLElement>(null);

interface FabButton {
  icon: Component
  label: string
  action: () => any
}

const buttons: Array<FabButton> = [
  {
    icon: LazyIconSearchRounded,
    label: 'open quick search',
    action: () => {
      props.onOpenSearch();
    },
  },
  {
    icon: LazyIconOutlineAdd,
    label: 'create new note or folder',
    action: () => {
      const { data: folder } = useNuxtData('folder');

      if (folder.value)
        preCreateItem(folder.value);
    },
  },
];

function withFoldCallback(func: () => any) {
  func();
  isFabUnfolded.value = !isFabUnfolded.value;
}

useClickOutside(fabContainer, () => isFabUnfolded.value = false);
</script>

<template>
  <div ref="fabContainer" class="fab-container">
    <Transition name="fade">
      <div
        v-show="isFabUnfolded"
        id="fab-buttons"
        class="fab__buttons"
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
      >
        <button
          v-for="(button, key) in buttons"
          v-once
          :key="key"
          class="fab"
          :aria-label="button.label"
          @click="withFoldCallback(button.action)"
        >
          <component :is="button.icon" class="fab__icon" />
        </button>
      </div>
    </Transition>

    <button
      class="fab fab--main"
      :class="{ 'fab--active': isFabUnfolded }"
      :aria-label="isFabUnfolded ? 'hide actions' : 'show more actions'"
      :aria-expanded="isFabUnfolded"
      aria-haspopup="menu"
      aria-controls="fab-buttons"
      @click="isFabUnfolded = !isFabUnfolded"
    >
      <Transition name="fade" mode="out-in">
        <span v-if="isFabUnfolded" :key="1">
          <IconCloseRounded class="fab__icon" />
        </span>

        <span v-else :key="2">
          <IconBaselineMoreVert class="fab__icon" />
        </span>
      </Transition>
    </button>
  </div>
</template>

<style lang="scss">
.fab-container {
  --button-size-basis: 11vw;
  --button-size-max: 4rem;
  --button-size-min: 4.5rem;

  position: fixed;
  bottom: calc(var(--button-size-max) / 3);
  left: calc(var(--button-size-max) / 3);
  z-index: 2;

  @media (max-width: $breakpoint-tablet) {
    right: calc(var(--button-size-max) / 3);
    left: unset;
  }
}

.fab {
  &--main {
    --button-size-basis: 14vw;
    --button-size-max: 4.75rem;
    --button-size-min: 5.25rem;
  }

  height: var(--button-size-basis);
  width: var(--button-size-basis);

  max-width: var(--button-size-max);
  min-width: var(--button-size-min);
  max-height: var(--button-size-max);
  min-height: var(--button-size-min);

  appearance: none;

  border: none;
  border-radius: 50%;
  background: hsla(var(--text-color-hsl), 1);
  box-shadow: 0 0 1rem hsla(var(--text-color-hsl), .1);

  cursor: pointer;
  transition: background-color .3s;

  @media (hover: hover) {
    background: hsla(var(--text-color-hsl), 0.7);
  }

  @supports (backdrop-filter: blur(1px)) {
    background: hsla(var(--text-color-hsl), .75);
    backdrop-filter: blur(5px);

    @media (hover: hover) {
      background: hsla(var(--text-color-hsl), .5);
    }
  }

  &__icon {
    color: hsla(var(--surface-color-hsl), 1);

    height: 50%;
    width: auto;

    transition: color .3s;

    @media (hover: hover) {
      color:hsla(var(--surface-color-hsl), 0.75);
    }
  }

  &__buttons {
    $number-of-fabs: 2;

    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.5rem;

    margin-bottom: 1.25rem;

    &.fade-enter-active .fab {
      transition: opacity 0.3s * 2 ease;
    }
    &.fade-enter-from .fab {
      opacity: 0;
    }

    @for $i from 0 to $number-of-fabs {
      &.fade-enter-active .fab:nth-child(#{($number-of-fabs - $i)}) {
        transition-delay: $i * 0.075s;
      }
    }
  }

  &:is(:hover, :focus-visible),
  &--active {
    background-color: hsla(var(--text-color-hsl), 1);

    svg {
      color: hsla(var(--surface-color-hsl), 1);
    }
  }
}
</style>
