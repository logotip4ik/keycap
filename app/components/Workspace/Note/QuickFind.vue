<script setup lang="ts">
import type { Editor } from '@tiptap/core';
import type { Decoration, DecorationSet } from '@tiptap/pm/view';

import { FindPluginKey } from '~/utils/tiptap';

const props = defineProps<{
  editor: Editor
  onClose: () => void
}>();

const noteContainerEl = useNoteContainer();
const inputEl = useTemplateRef('inputEl');

const noMatches = ref(false);

const hints = [
  { key: 'Esc', label: 'cancel' },
  { key: 'Enter', label: 'select match' },
  { key: 'Tab', label: 'next match' },
  { key: 'Shift+Tab', label: 'previous match' },
];

let initialScroll: number | undefined;
function revertScroll() {
  if (initialScroll !== undefined) {
    noteContainerEl.value?.scrollTo({
      top: initialScroll,
      left: 0,
      behavior: 'instant',
    });
  }
}

function getDecoration(): Decoration | undefined {
  const decorationSet = FindPluginKey.getState(props.editor.state) as DecorationSet;
  const decorations = decorationSet.find();

  return decorations[0];
}

function showMatch(value: string, opts?: { from?: number } | { to?: number }) {
  value = value.trim();
  if (noMatches.value) {
    noMatches.value = false;
  }

  if (!opts || 'from' in opts) {
    props.editor.commands.findNextMatch(
      value,
      opts ? { from: opts.from, retainPastMatchesOnNotFound: true } : undefined,
    );
  }
  else if (opts && 'to' in opts) {
    props.editor.commands.findPreviousMatch(
      value,
      { to: opts.to, retainPastMatchesOnNotFound: true },
    );
  }

  const decoration = getDecoration();

  if (!decoration) {
    if (opts) {
      return;
    }

    revertScroll();
    if (value !== '') {
      noMatches.value = true;
    }

    return;
  }

  if (initialScroll === undefined) {
    initialScroll = noteContainerEl.value?.scrollTop;
  }

  const { node } = props.editor.view.domAtPos(decoration.from);
  if (node) {
    (node as HTMLElement).scrollIntoView({ block: 'center' });
  }
}
const debouncedShowMatch = debounce(showMatch, 10);

function handleClose() {
  props.editor.commands.hideAllMatches();
  props.onClose();
}

function focusFind() {
  const decoration = getDecoration();
  if (!decoration) {
    return;
  }

  props.editor.chain().focus().setTextSelection(decoration).run();
}

function handleKeydown(event: KeyboardEvent) {
  const { key, shiftKey } = event;
  switch (key) {
    case 'Tab': {
      event.preventDefault();

      const decoration = getDecoration();
      if (decoration && inputEl.value) {
        showMatch(
          inputEl.value.value,
          shiftKey ? { to: decoration.from } : { from: decoration.to },
        );
      }
      break;
    }
    case 'Enter':
      focusFind();
      break;
    case 'Escape':
      event.preventDefault();
      // this is needed to require pressing esc again after closing
      event.stopPropagation();

      revertScroll();
      handleClose();
      break;
  }
}

onMounted(() => {
  inputEl.value?.focus();
});
</script>

<template>
  <div class="quick-find">
    <label for="quick-find" class="sr-only">Find text in note</label>

    <input
      id="quick-find"
      ref="inputEl"
      class="quick-find__input"
      :class="{ 'quick-find__input--no-matches': noMatches }"
      @blur="handleClose"
      @keydown="handleKeydown"
      @input="debouncedShowMatch(($event.target as HTMLInputElement).value)"
    >

    <WithFadeTransition>
      <div v-if="noMatches" key="1" class="quick-find__hints">
        <small class="quick-find__hints__hint quick-find__hints__hint--single">No matches found</small>
      </div>

      <div v-else key="2" class="quick-find__hints">
        <small v-for="hint in hints" :key="hint.key" class="quick-find__hints__hint">
          {{ hint.key }} - {{ hint.label }}
        </small>
      </div>
    </WithFadeTransition>
  </div>
</template>

<style lang="scss">
.quick-find {
  position: fixed;
  bottom: 1rem;
  left: 50%;

  width: 90vw;
  max-width: 575px;

  padding: 0.5rem;

  border-radius: 0.5rem;
  border: 1px solid hsla(var(--text-color-hsl), 0.1);
  box-shadow:
    inset -1px -1px 0.1rem rgba($color: #000000, $alpha: 0.025),
    1.3px 1.3px 5.3px rgba(0, 0, 0, 0.028),
    4.5px 4.5px 17.9px rgba(0, 0, 0, 0.042),
    20px 20px 80px rgba(0, 0, 0, 0.07);

  transform: translateX(-50%);

  &::before {
    content: '';

    position: absolute;
    z-index: -1;
    inset: 0;
    border-radius: inherit;

    background-color: rgba(var(--surface-color-hsl), 0.98);
    @supports (backdrop-filter: blur(1px)) {
      backdrop-filter: blur(5px);
      background-color: hsla(var(--surface-color-hsl), 0.5);
    }
  }

  &__label {
    visibility: hidden;
  }

  &__input {
    display: block;

    font: inherit;
    font-size: 1rem;
    color: currentColor;
    line-height: 1.5;

    width: 100%;

    margin: 0 0 0.4rem;
    padding: 0.25rem 0.75rem;

    border-radius: 0.25rem;
    border: 1px solid var(--task-list-indicator-color);
    box-shadow: none;
    appearance: none;
    outline: none;
    background-color: transparent;

    transition: border-color 0.3s;

    &--no-matches {
      border-color: hsla(var(--error-color-hsl), 0.5);
    }
  }

  &__hints {
    display: flex;
    justify-content: space-between;

    padding-inline: 0.66rem;

    &__hint {
      display: block;

      color: hsla(var(--text-color-hsl), 0.75);
      line-height: 1;

      &--single {
        margin-right: auto;
      }
    }
  }

  &__result {
    background-color: var(--selection-bg-color);
  }
}
</style>
