<script setup lang="ts">
import type { Editor } from '@tiptap/core';
import type { ComponentPublicInstance } from 'vue';
import type { Replacement } from './replacements';

import { replacements } from './replacements';

const props = defineProps<{
  editor: Editor
  shouldBeVisible: boolean
  items: Array<Replacement>
  onSelect?: (emoji: Replacement) => void
  onClose: () => void
  getBoundingClientRect?: () => DOMRect
}>();

const replacementsComp = useTemplateRef<ComponentPublicInstance>('replacementsComp');
const replacementsEl = computed(() => replacementsComp.value?.$el as HTMLUListElement | undefined);

const { selectedItem, isVisible, updatePosition } = useSuggestion(replacementsEl, props);

const { rememberSize, animateSize } = getContainerDimensionsTransition(replacementsEl);

function handleKeypress(event: KeyboardEvent) {
  if (!props.shouldBeVisible) {
    return false;
  }

  const target = event.target as HTMLButtonElement;

  const isArrowUp = event.key === 'ArrowUp';
  const isArrowDown = event.key === 'ArrowDown';
  const focusInsideSuggestions = replacementsEl.value?.contains(target);

  if (isArrowDown && !focusInsideSuggestions) {
    const button = replacementsEl.value?.querySelector('button');

    button?.focus();

    event.preventDefault();

    return true;
  }

  if (isArrowUp && selectedItem.value === 0 && focusInsideSuggestions) {
    props.editor.commands.focus();
    return true;
  }

  const items = props.items;
  if (isArrowUp || isArrowDown) {
    const parent = target.parentElement as HTMLLIElement;

    const next = isArrowDown
      ? parent.nextElementSibling
      : parent.previousElementSibling;

    (next?.firstElementChild as HTMLElement | undefined)?.focus();

    return true;
  }
  else if (event.key === 'Esc' || event.key === 'Escape') {
    props.onClose();
    event.preventDefault();
    event.stopPropagation();

    return true;
  }
  else if (event.key === 'Enter') {
    props.onSelect?.(items[selectedItem.value]);
    event.preventDefault();

    return true;
  }
  else if (event.ctrlKey && event.key === 'n') {
    selectedItem.value = (selectedItem.value + 1) % items.length;
    event.preventDefault();
  }
  else if (event.ctrlKey && event.key === 'p') {
    selectedItem.value = (selectedItem.value - 1 + items.length) % items.length;
    event.preventDefault();
  }
}

function animateContainer() {
  const animation = animateSize();

  if (!animation) {
    return;
  }

  const loop = () => {
    updatePosition();
    if (animation.playState === 'running') {
      requestAnimationFrame(loop);
    }
  };

  requestAnimationFrame(loop);
}

defineExpose({ handleKeypress });
</script>

<template>
  <Teleport to="#teleports">
    <WithFadeTransition appear>
      <WithListTransitionGroup
        v-show="isVisible"
        ref="replacementsComp"
        tag="ul"
        class="replacements fast-fade"
        @enter="animateContainer"
        @leave="animateContainer"
        @before-leave="rememberSize"
        @before-enter="rememberSize"
      >
        <li v-for="(command, i) in items" :key="command" class="replacements__item">
          <button
            class="replacements__item__button"
            :aria-selected="selectedItem === i"
            @focus="selectedItem = i"
            @click="onSelect?.(command)"
            @keydown="handleKeypress"
          >
            <span class="replacements__item__button__name">
              {{ replacements[command].name }}
            </span>

            <code v-if="'replacement' in replacements[command]" class="replacements__item__button__replacement">
              {{ replacements[command].replacement() }}
            </code>

            <span aria-hidden="true" :style="{ opacity: selectedItem === i ? undefined : 0 }">
              <Icon name="round-keyboard-return" />
            </span>
          </button>
        </li>
      </WithListTransitionGroup>
    </WithFadeTransition>
  </Teleport>
</template>

<style lang="scss">
.replacements {
  --base-shadow-color: 0, 0, 0;

  display: flex;
  flex-direction: column;
  gap: 0.33rem;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  max-width: min(21rem, 90%);
  width: 100%;

  margin: 0;
  padding: 0.37rem 0.33rem;

  border-radius: 0.25rem;
  border: 1px solid hsla(var(--text-color-hsl), 0.1);
  background-color: rgba(var(--surface-color-hsl), 0.98);
  box-shadow:
    inset -1px -1px 0.1rem rgba($color: #000000, $alpha: 0.025),
    1.3px 1.3px 5.3px rgba(0, 0, 0, 0.028),
    4.5px 4.5px 17.9px rgba(0, 0, 0, 0.042),
    20px 20px 80px rgba(0, 0, 0, 0.07);

  list-style-type: none;

  @supports (backdrop-filter: blur(1px)) {
    backdrop-filter: blur(8px);
    background-color: hsla(var(--surface-color-hsl), 0.5);
  }

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 180, 180, 180;
  }

  &__item {
    &__button {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 0.5rem;

      font-size: 80%;

      width: 100%;
      min-height: 2rem;

      margin: 0;
      padding: 0.35rem 0.65rem;

      border: 1px solid hsla(var(--text-color-hsl), 0.075);
      border-radius: 0.125rem;
      background-color: hsla(var(--text-color-hsl), 0.01);
      appearance: none;

      backdrop-filter: blur(2px);

      cursor: pointer;
      transition: background-color .4s;

      &__name {
        margin-right: auto;
      }

      &__replacement {
        font-size: 90%;
        color: hsla(var(--text-color-hsl), 0.5);
      }

      &:is(:focus, :hover) {
        background-color: hsla(var(--surface-color-hsl), 0.25);
        background-color: hsla(var(--selection-bg-color-hsl), 0.175);
        outline: none;

        transition: background-color .1s;
      }
    }
  }
}
</style>
