<script setup lang="ts">
import parseDuration from 'parse-duration';

import { flip, offset } from '@floating-ui/core';
import { computePosition } from '@floating-ui/dom';

interface MenuAction {
  name: string
  needConfirmation?: boolean
  handler: () => void | Promise<void>
}

const props = defineProps<{
  target: HTMLElement
  item: FolderOrNote
  parent: FolderWithContents
  onClose: () => void
}>();

const createToast = useToaster();
const detailsItem = useCurrentItemForDetails();

const isFolder = 'root' in props.item;

const menu = shallowRef<null | HTMLElement>(null);
const currentlyConfirming = ref(-1); // You can confirm one at a time

const actions = [
  { name: 'open in a new tab', handler: openNewTab },
  { name: 'preload', handler: preloadItemWithIndication },
  { name: 'rename', handler: renameItem },
  { name: 'show details', handler: showDetails },
  { name: 'delete', needConfirmation: true, handler: deleteItem },
];

let cleanup: null | (() => void);
const confirmDuration = parseDuration('5 seconds')!;

function withEffects(event: Event, action: MenuAction) {
  if (event.type === 'click' && !action.needConfirmation)
    return action.handler();

  if (event.type === 'pointerdown' && action.needConfirmation) {
    const targetCancelEvents = ['pointerup', 'pointerleave', 'touchend', 'touchcancel'];
    const target = event.target as HTMLElement;

    currentlyConfirming.value = actions.indexOf(action);

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

function preloadItemWithIndication() {
  const loadingToast = createToast(`Preloading into cache: "${props.item.name}"`, {
    delay: 250,
    duration: parseDuration('0.5 minute'),
    type: 'loading',
  });

  preloadItem(props.item)
    .finally(() => loadingToast.remove());

  props.onClose();
}

function renameItem() {
  extend(props.item, { editing: true });

  props.onClose();
}

function showDetails() {
  detailsItem.value = props.item;

  props.onClose();
}

function deleteItem() {
  const deleteItem = isFolder ? deleteFolder : deleteNote;

  deleteItem(props.item, props.parent);

  props.onClose();
}

function openNewTab() {
  let itemPath = props.item.path.replace('/', '/@');

  if (isFolder)
    itemPath += `/${BLANK_NOTE_NAME}`;

  window.open(itemPath, 'target=_blank');

  props.onClose();
}

useClickOutside(menu, () => props.onClose());

useTinykeys({
  Escape: () => props.onClose(),
});

onMounted(async () => {
  props.target.classList.add('selected');

  if (!menu.value)
    return;

  const { x, y } = await computePosition(props.target, menu.value, {
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip(),
    ],
  });

  menu.value.style.top = `${y}px`;
  menu.value.style.left = `${x}px`;
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;

  props.target.classList.remove('selected');
});
</script>

<template>
  <Teleport :to="props.target.parentElement">
    <WithFadeTransition appear>
      <ul
        ref="menu"
        role="menu"
        class="item-context-menu fast-fade"
        aria-orientation="vertical"
        tabindex="-1"
      >
        <li
          v-for="(action, key) in actions"
          :key="key"
          class="item-context-menu__item"
        >
          <button
            class="item-context-menu__item__button"
            @click="withEffects($event, action)"
            @pointerdown="withEffects($event, action)"
          >
            <WithFadeTransition>
              <span v-if="currentlyConfirming !== key">
                {{ action.name }}
              </span>
              <span v-else>
                Hold to confirm
              </span>
            </WithFadeTransition>
          </button>
        </li>
      </ul>
    </WithFadeTransition>
  </Teleport>
</template>

<style lang="scss">
.item-context-menu {
  --base-color-saturation: 0.0;
  --base-shadow-color: 0, 0, 0;

  position: absolute;
  top: 0;
  left: 0;
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

      @media (max-width: $breakpoint-tablet) {
        font-size: 1.1rem;
        padding: 0.5rem 1.5rem;
      }
    }
  }
}
</style>
