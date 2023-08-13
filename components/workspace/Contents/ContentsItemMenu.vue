<script setup lang="ts">
import { createPopper } from '@popperjs/core';
import parseDuration from 'parse-duration';

import type { Instance as PopperInstance, VirtualElement } from '@popperjs/core';

interface MenuAction {
  name: string
  needConfirmation?: boolean
  handler: () => any | Promise<any>
}

interface Props { x: number; y: number; actions: Array<MenuAction>; onClose: () => void }
const props = defineProps<Props>();

const popperInstance = shallowRef<null | PopperInstance>(null);
const menu = ref<null | HTMLElement>(null);
const currentlyConfirming = ref(-1); // You can confirm one at a time
let cleanup: null | (() => void);

const confirmDuration = parseDuration('5 seconds')!;
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

function withEffects(event: Event, action: MenuAction) {
  if (event.type === 'click' && !action.needConfirmation)
    return action.handler();

  if (event.type === 'pointerdown' && action.needConfirmation) {
    const targetCancelEvents = ['pointerup', 'pointerleave', 'touchend', 'touchcancel'];
    const target = event.target as HTMLElement;

    currentlyConfirming.value = Number(target.getAttribute('data-key'));

    const animation = target.animate([
      { opacity: 1, transform: 'translate(-100%, 0%)' },
      { opacity: 1, transform: 'translate(0%, 0%)' },
    ], { duration: confirmDuration, pseudoElement: '::after' });

    cleanup = () => {
      animation.cancel?.();
      currentlyConfirming.value = -1;

      for (const eventType of targetCancelEvents)
        target.removeEventListener(eventType, cleanup!);
    };

    animation.addEventListener('finish', () => {
      action.handler();

      cleanup!();
      cleanup = null;
    });

    for (const eventType of targetCancelEvents)
      target.addEventListener(eventType, cleanup);
  }
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

useClickOutside(menu, () => props.onClose());

useTinykeys({
  Escape: () => props.onClose(),
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<template>
  <ul
    ref="menu"
    role="menu"
    class="item-context-menu"
    aria-orientation="vertical"
    tabindex="-1"
  >
    <li
      v-for="(action, key) in actions"
      :key="key"
      class="item-context-menu__item"
    >
      <button
        :data-key="key"
        class="item-context-menu__item__button"
        @click="withEffects($event, action)"
        @pointerdown="withEffects($event, action)"
      >
        <Transition name="fade">
          <span v-if="currentlyConfirming !== key">
            {{ action.name }}
          </span>
          <span v-else>
            Hold to confirm
          </span>
        </Transition>
      </button>
    </li>
  </ul>
</template>

<style lang="scss">
.item-context-menu {
  --base-color-saturation: 0.0;
  --base-shadow-color: 0, 0, 0;

  z-index: 2;

  color: hsla(var(--text-color-hsl), 0.7);

  width: 100%;
  max-width: 22ch;

  padding: 0.5rem 0;

  list-style-type: none;
  border-radius: 0.25rem;
  background-color: hsla(var(--surface-color-hsl), 0.9);
  box-shadow:
    0px 2px 5.3px rgba(var(--base-shadow-color), 0.02),
    0px 6.7px 17.9px rgba(var(--base-shadow-color), 0.03),
    0px 30px 80px rgba(var(--base-shadow-color), 0.05);

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
    --base-color-saturation: 0.1;
  }

  @supports (backdrop-filter: blur(1px)) {
    background-color: transparent;
    background-image: linear-gradient(
      to bottom,
      hsla(var(--selection-bg-color-hsl), calc(var(--base-color-saturation) + 0.075)),
      hsla(var(--selection-bg-color-hsl), calc(var(--base-color-saturation) + 0.175)),
    );
    border: 1px solid hsla(var(--selection-bg-color-hsl), 0.5);
    backdrop-filter: blur(12px);
  }

  &__item {
    &__button {
      display: block;

      position: relative;
      isolation: isolate;
      z-index: 1;

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
      overflow: hidden;

      transition: color .3s;

      &::after {
        content: "";

        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;

        width: 100%;
        height: 100%;

        opacity: 0;
        background-color: hsla(var(--text-color-hsl), 0.075);

        transition: .3s opacity;
      }

      @media (hover: hover) {
        color: hsla(var(--text-color-hsl), 0.75);

        &:hover {
          color: hsla(var(--text-color-hsl), 1);
          transition-duration: 0.1s;

          &::after {
            opacity: 1;
            transition-duration: 0.1s;
          }
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
