<script setup lang="ts">
import type { ChainedCommands, Editor } from '@tiptap/core';
import type { Level } from '@tiptap/extension-heading';
import type { ResolvedPos } from '@tiptap/pm/model';

import { LinkInputPlaceholder, marks } from './config';

const props = defineProps<{
  editor: Editor
}>();

const formatterEl = shallowRef<HTMLElement | null>(null);

const linkInputPlaceholder = ref(LinkInputPlaceholder.INITIALLY_EMPTY);
const isEditingLink = ref(false);
const editingLink = ref('');

const modKey = useModKey();
const { setting: formatterPosition } = useSetting(settings.formatterPosition);

let prevListItem: string | undefined;
let prevHeadingLevel: number | undefined;
const prevSelection = { start: -1, end: -1 };

let prevContainerWidth: number;
function rememberContainerWidth(el: Element) {
  prevContainerWidth = getElementWidth(el.parentElement);
}

function animateContainerWidth(el: Element) {
  const currentContainerWidth = getElementWidth(el.parentElement);
  const containerWidthDiff = Math.abs(prevContainerWidth - currentContainerWidth);

  if (containerWidthDiff > 2) {
    el.parentElement?.animate(
      [{ width: `${prevContainerWidth}px` }, { width: `${currentContainerWidth}px` }],
      { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
  }

  if (!isEditingLink.value) {
    return;
  }

  const activeUrl = props.editor.isActive('link')
    ? props.editor.getAttributes('link').href
    : '';

  editingLink.value = activeUrl;
  linkInputPlaceholder.value = activeUrl ? LinkInputPlaceholder.MADE_EMPTY : LinkInputPlaceholder.INITIALLY_EMPTY;

  prevSelection.start = props.editor.state.selection.from;
  prevSelection.end = props.editor.state.selection.to;

  nextTick(() => {
    const input = el.querySelector('input');

    input?.focus();
    input?.select();
  });
}

function resetSelection() {
  props
    .editor
    .chain()
    .focus()
    .setTextSelection({
      from: prevSelection.start,
      to: prevSelection.end,
    })
    .run();
}

function trySaveEditingLink() {
  isEditingLink.value = false;

  if (editingLink.value.startsWith('http')) {
    props.editor.commands.setLink({
      href: editingLink.value,
    });
  }
  else {
    props.editor.commands.unsetLink();
  }

  resetSelection();
}

function toggleHeading() {
  let actionIdx = 0;

  const commands = props.editor!.chain().focus();

  for (let i = 0; i < 3; i++) {
    if (props.editor.isActive('heading', { level: i + 1 })) {
      if (prevHeadingLevel === undefined) {
        prevHeadingLevel = i + 1;
      }

      actionIdx = i + 1;

      break;
    }
  }

  if (prevHeadingLevel && prevHeadingLevel !== -1) {
    commands.toggleHeading({ level: prevHeadingLevel as Level }).run();

    prevHeadingLevel = -1;

    return;
  }

  const actions = [
    (commands: ChainedCommands) => commands.setHeading({ level: 1 }),
    (commands: ChainedCommands) => commands.toggleHeading({ level: 2 }),
    (commands: ChainedCommands) => commands.toggleHeading({ level: 3 }),
    (commands: ChainedCommands) => commands.toggleHeading({ level: 3 }),
  ];

  const toggleWith = actions.at(actionIdx);

  toggleWith?.(commands).run();

  prevHeadingLevel = -1;
}

const lists = ['bulletList', 'orderedList', 'taskList'];
function toggleListItem() {
  let actionIdx = 0;

  const commands = props.editor.chain().focus();

  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];

    if (props.editor.isActive((list))) {
      if (prevListItem === undefined) {
        prevListItem = list;
      }

      actionIdx = i + 1;
    }
  }

  if (prevListItem && prevListItem !== 'auto') {
    if (prevListItem === 'taskList') {
      commands.toggleTaskList().run();
    }
    else {
      commands.liftListItem('listItem').run();
    }

    prevListItem = 'auto'; // enable cycling on next toggle

    return;
  }

  const actions = [
    (commands: ChainedCommands) => commands.toggleBulletList(),
    (commands: ChainedCommands) => commands.toggleOrderedList(),
    (commands: ChainedCommands) => commands.toggleTaskList(),
    (commands: ChainedCommands) => commands.toggleTaskList(),
  ];

  const toggleWith = actions.at(actionIdx);

  toggleWith?.(commands).run();

  prevListItem = 'auto';
}

function focusFormatter(event: KeyboardEvent) {
  const { from, to } = props.editor.state.selection;

  if (!formatterEl.value || (props.editor.isFocused && to - from <= 0)) {
    return;
  }

  event.preventDefault();
  (formatterEl.value.firstElementChild as HTMLElement).focus();
}

function focusEditor(event: KeyboardEvent) {
  if (formatterEl.value && formatterEl.value.contains(event.target as HTMLElement)) {
    event.preventDefault();
    props.editor.commands.focus();
  }
}

useTinykeys({
  'ArrowDown': (event) => {
    const focusAction = formatterPosition.value === 'bottom'
      ? focusFormatter
      : focusEditor;

    focusAction(event);
  },

  'ArrowUp': (event) => {
    const focusAction = formatterPosition.value === 'top'
      ? focusFormatter
      : focusEditor;

    focusAction(event);
  },

  // NOTE: change this to $mod+Shift+l if main ctrl+l keeps getting in place
  '$mod+l': (event) => {
    const { from, to } = props.editor.state.selection;

    if (props.editor.isFocused && to - from <= 0) {
      return;
    }

    event.preventDefault();

    isEditingLink.value = !isEditingLink.value;

    if (!isEditingLink.value) {
      resetSelection();
    }
  },
});

// NOTE: this is needed for correct cycle effect of text formatting
let prevAnchor: ResolvedPos | undefined;
watch(() => props.editor.state.selection.$anchor, (anchor) => {
  const currentTextContent = anchor.node(anchor.depth).textContent;
  const prevTextContent = prevAnchor && prevAnchor.node(prevAnchor.depth).textContent;

  const whitespaceChanged = !!prevAnchor
    && currentTextContent === ''
    && prevTextContent === ''
    && prevAnchor.pos !== anchor.pos;

  // different node in editor is selected
  if (currentTextContent !== prevTextContent || whitespaceChanged) {
    isEditingLink.value = false;
    prevListItem = undefined;
    prevHeadingLevel = undefined;
  }

  prevAnchor = anchor;
});

useFocusTrap(formatterEl);
</script>

<template>
  <WithFadeTransition @before-leave="rememberContainerWidth" @enter="animateContainerWidth">
    <div v-if="!isEditingLink" ref="formatterEl" class="formatter__contents-wrapper">
      <WithTooltip>
        <template #default="{ tooltipId }">
          <button
            class="formatter__button"
            :class="{ 'formatter__button--active': editor.isActive('heading') }"
            aria-label="cycle heading"
            :aria-pressed="editor.isActive('heading')"
            :aria-describedby="tooltipId"
            @click="toggleHeading"
          >
            <LazyIconHeading1 v-if="editor.isActive('heading', { level: 1 })" />
            <LazyIconHeading2 v-else-if="editor.isActive('heading', { level: 2 })" />
            <LazyIconHeading3 v-else-if="editor.isActive('heading', { level: 3 })" />
            <LazyIconHeading1 v-else />
          </button>
        </template>

        <template #tooltip>
          <!-- TODO: show different number depending on current heading level -->
          <kbd>{{ modKey }}+Alt+1</kbd>
        </template>
      </WithTooltip>

      <WithTooltip>
        <template #default="{ tooltipId }">
          <button
            class="formatter__button"
            :class="{
              'formatter__button--active':
                editor.isActive('taskItem') || editor.isActive('listItem'),
            }"
            aria-label="cycle list"
            :aria-pressed="editor.isActive('taskItem') || editor.isActive('listItem')"
            :aria-describedby="tooltipId"
            @click="toggleListItem"
          >
            <LazyIconList />
          </button>
        </template>

        <template #tooltip>
          <kbd>{{ modKey }}+Shift+8</kbd>
        </template>
      </WithTooltip>

      <WithTooltip>
        <template #default="{ tooltipId }">
          <button
            class="formatter__button"
            :class="{
              'formatter__button--active': editor.isActive('blockquote'),
            }"
            aria-label="toggle blockquote"
            :aria-pressed="editor.isActive('blockquote')"
            :aria-describedby="tooltipId"
            @click="editor.chain().focus().toggleBlockquote().run()"
          >
            <LazyIconDoubleQuotesR />
          </button>
        </template>

        <template #tooltip>
          <kbd>{{ modKey }}+Shift+B</kbd>
        </template>
      </WithTooltip>

      <div class="formatter__vr" aria-hidden="true" />

      <WithTooltip v-for="(mark, i) in marks" :key="i">
        <template #default="{ tooltipId }">
          <button
            class="formatter__button"
            :class="{ 'formatter__button--active': mark.isActive(editor) }"
            :aria-label="mark.ariaLabel"
            :aria-pressed="mark.isActive(editor)"
            :aria-describedby="tooltipId"
            @click="mark.onClick ? mark.onClick(editor) : (isEditingLink = !isEditingLink)"
          >
            <Component :is="mark.icon" />
          </button>
        </template>

        <template #tooltip>
          <kbd>{{ mark.shortcut() }}</kbd>
        </template>
      </WithTooltip>
    </div>

    <form v-else class="formatter__contents-wrapper" @submit.prevent="trySaveEditingLink">
      <input
        v-model="editingLink"
        type="url"
        class="formatter__input"
        :placeholder="linkInputPlaceholder"
        enterkeyhint="done"
        @keydown.esc="trySaveEditingLink"
      >

      <button class="formatter__button" type="submit">
        <LazyIconBaselineCheck />
      </button>
    </form>
  </WithFadeTransition>
</template>

<style lang="scss">
.formatter {
  --items-spacing: 0.5rem;

  &__vr {
    flex: 0 0 1px;
    align-self: stretch;

    background-color: hsla(var(--text-color-hsl), 0.1);
  }

  &__contents-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--items-spacing);
  }

  &__input {
    align-self: stretch;

    font: inherit;
    font-size: 0.9rem;
    line-height: 0.5;
    color: var(--text-color);

    width: 95vw;
    max-width: 35ch;

    padding: 0 0.5rem;

    appearance: none;
    background-color: transparent;
    border-radius: .25rem;
    border: 1px solid hsla(var(--text-color-hsl), 0.5);

    transition: border-color .4s;

    &:is(:hover, :focus-visible) {
      outline: none;
      border-color: var(--text-color);

      transition: border-color .1s;
    }

    &:user-invalid {
      border-color: var(--error-color);
    }

    @media (max-width: $breakpoint-tablet) {
      max-width: 32ch;
    }
  }

  &__button {
    --size-basis: 2rem;

    flex-shrink: 0;

    font-size: 1rem;
    color: hsla(var(--text-color-hsl), 0.5);

    width: var(--size-basis);
    height: var(--size-basis);

    appearance: none;
    background-color: transparent;
    border: 1px solid hsla(var(--text-color-hsl), 0.5);
    border-radius: .25rem;

    scroll-snap-align: start;
    cursor: pointer;
    transition: color .4s, border .4s, background-color .4s;

    &:is(:hover, :focus) {
      color: hsla(var(--text-color-hsl), 1);

      border: 1px solid hsla(var(--text-color-hsl), 0.75);

      transition: color .1s, border .1s, background-color .1s;
    }

    &--active {
      color: hsla(var(--surface-color-hsl), 0.75);

      border: 1px solid transparent;
      background-color: hsla(var(--text-color-hsl), 0.55);

      &:is(:hover, :focus) {
        color: hsla(var(--surface-color-hsl), 1);

        background-color: hsla(var(--text-color-hsl), 0.85);
      }
    }

    svg {
      display: inline-block;

      width: calc(var(--size-basis) * 0.425);
      height: auto;
    }

    @media (max-width: $breakpoint-tablet) {
      --size-basis: calc(2.25rem + 1.5vw);

      @media (max-width: 400px) {
        --size-basis: 2.25rem;
      }
    }
  }

  &.inline-menu {
    .formatter {
      &__input {
        max-width: min(75vw, $breakpoint-tablet - 75px);
      }

      &__wrapper {
        justify-content: center;
      }
    }
  }
}
</style>
