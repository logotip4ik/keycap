<script setup lang="ts">
import { createPopper } from '@popperjs/core';

import type { Instance as PopperInstance, VirtualElement } from '@popperjs/core';

interface MenuAction {
  name: string
  action: () => any | Promise<any>
}

interface Emits { (event: 'close'): void }
interface Props { x: number; y: number; actions: MenuAction[] }
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const popperInstance = shallowRef<null | PopperInstance>(null);
const menu = ref<null | HTMLElement>(null);

const virtualElement: VirtualElement = {
  // @ts-expect-error missing toJSON method
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    top: props.y,
    right: props.x,
    bottom: props.y,
    left: props.x,
  }),
};

function onClickOutside() {
  emit('close');
}

watch([() => props.x, () => props.y], async () => {
  if (!menu.value) {
    await nextTick();
    await nextTick();
  }

  if (!popperInstance.value) {
    popperInstance.value = createPopper(virtualElement, menu.value!, {
      placement: 'auto-end',
    });
  }

  popperInstance.value?.update();
}, { immediate: true });

useClickOutside(menu, onClickOutside);
</script>

<template>
  <ul ref="menu" class="item-context-menu">
    <li
      v-for="(action, key) in actions"
      :key="key"
      class="item-context-menu__item"
    >
      <button
        class="item-context-menu__item__button"
        @click="action.action"
      >
        {{ action.name }}
      </button>
    </li>
  </ul>
</template>

<style lang="scss">
.item-context-menu {
  z-index: 2;

  color: hsla(var(--text-color-hsl), 0.7);

  width: 100%;
  max-width: 22ch;

  padding: 0.5rem 0;

  list-style-type: none;
  border-radius: 0.25rem;
  background-color: hsla(var(--surface-color-hsl), 0.9);
  box-shadow:
    0px 2px 5.3px rgba(0, 0, 0, 0.02),
    0px 6.7px 17.9px rgba(0, 0, 0, 0.03),
    0px 30px 80px rgba(0, 0, 0, 0.05);

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--selection-bg-color-hsl), 0.15);
    backdrop-filter: blur(6px);
  }

  &__item {
    &__button {
      display: block;

      font: inherit;
      color: hsla(var(--text-color-hsl), 1);
      text-align: left;

      width: 100%;

      padding: 0.4rem 1.5rem;

      appearance: none;
      border: none;
      outline: none;
      background-color: transparent;
      cursor: pointer;

      transition: color .3s, background-color .3s;

      @media (hover: hover) {
        color: hsla(var(--text-color-hsl), 0.75);

        &:hover {
          color: hsla(var(--text-color-hsl), 1);
          background-color: hsla(var(--text-color-hsl), 0.075);

          transition-duration: 0.1s;
        }
      }

      @media screen and (max-width: $breakpoint-tablet) {
        font-size: 1.1rem;
        padding: 0.5rem 1.5rem;
      }
    }
  }
}
</style>
