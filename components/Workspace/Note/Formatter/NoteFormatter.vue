<script setup lang="ts">
import type { ChainedCommands, Editor } from '@tiptap/core';
import type { Level } from '@tiptap/extension-heading';
import type { ResolvedPos } from '@tiptap/pm/model';

const props = defineProps<{
  editor: Editor
}>();

const LinkInputPlaceholder = {
  INITIALLY_EMPTY: 'hit enter to show menu',
  MADE_EMPTY: 'hit enter to remove link',
};

const linkInputPlaceholder = ref(LinkInputPlaceholder.INITIALLY_EMPTY);
const isEditingLink = ref(false);
const editingLink = ref('');

let prevListItem: string | undefined;
let prevHeadingLevel: number | undefined;
const prevSelection = { start: -1, end: -1 };

let prevContainerWidth: number;
function rememberContainerWidth(el: Element) {
  prevContainerWidth = el.parentElement?.offsetWidth || 0;
}

function animateContainerWidth(el: Element) {
  const currentContainerWidth = el.parentElement?.offsetWidth || 0;
  const containerWidthDiff = Math.abs(prevContainerWidth - currentContainerWidth);

  if (containerWidthDiff < 2) {
    el.parentElement?.animate(
      [{ width: `${prevContainerWidth}px` }, { width: `${currentContainerWidth}px` }],
      { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
  }

  if (!isEditingLink.value)
    return;

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

function saveEditingLink() {
  if (editingLink.value !== '') {
    const mark = props.editor.schema.mark('link', { href: editingLink.value });

    const { from, to } = props.editor.state.selection;
    props.editor.view.dispatch(
      props.editor.view.state.tr.addMark(from, to, mark),
    );
  }
  else {
    props.editor.commands.unsetLink();
  }

  isEditingLink.value = false;

  props.editor.commands.focus(prevSelection.end);
}

function hideLinkInput() {
  isEditingLink.value = false;

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

function toggleHeading() {
  let actionIdx = 0;

  const commands = props.editor!.chain().focus();

  for (let i = 0; i < 3; i++) {
    if (props.editor.isActive('heading', { level: i + 1 })) {
      if (prevHeadingLevel === undefined)
        prevHeadingLevel = i + 1;

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

function toggleListItem() {
  let actionIdx = 0;

  const commands = props.editor!.chain().focus();

  ['bulletList', 'orderedList', 'taskList'].forEach((list, i) => {
    if (props.editor.isActive(list)) {
      if (prevListItem === undefined)
        prevListItem = list;

      actionIdx = i + 1;
    }
  });

  if (prevListItem && prevListItem !== 'auto') {
    if (prevListItem === 'taskList')
      commands.toggleTaskList().run();
    else commands.liftListItem('listItem').run();

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

useTinykeys({
  // NOTE: change this to $mod+Shift+l if main ctrl+l keeps getting in place
  '$mod+l': (event) => {
    const { from, to } = props.editor.state.selection;

    if (props.editor.isFocused && to - from <= 0)
      return;

    event.preventDefault();

    isEditingLink.value = !isEditingLink.value;
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
</script>

<template>
  <WithFadeTransition @before-leave="rememberContainerWidth" @enter="animateContainerWidth">
    <div v-if="!isEditingLink" class="formatter__contents-wrapper">
      <button
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('heading') }"
        :aria-pressed="editor.isActive('heading')"
        aria-label="cycle heading"
        @click="toggleHeading"
      >
        <LazyIconHeading1 v-if="editor.isActive('heading', { level: 1 })" />
        <LazyIconHeading2 v-else-if="editor.isActive('heading', { level: 2 })" />
        <LazyIconHeading3 v-else-if="editor.isActive('heading', { level: 3 })" />
        <LazyIconHeading1 v-else />
      </button>

      <button
        class="formatter__button"
        :class="{
          'formatter__button--active':
            editor.isActive('taskItem') || editor.isActive('listItem'),
        }"
        :aria-pressed="editor.isActive('taskItem') || editor.isActive('listItem')"
        aria-label="cycle list"
        @click="toggleListItem"
      >
        <LazyIconList />
      </button>

      <button
        class="formatter__button"
        :class="{
          'formatter__button--active': editor.isActive('blockquote'),
        }"
        :aria-pressed="editor.isActive('blockquote')"
        aria-label="toggle blockquote"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <LazyIconDoubleQuotesR />
      </button>

      <div class="formatter__vr" aria-hidden="true" />

      <button
        title="CTRL+B"
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('bold') }"
        :aria-pressed="editor.isActive('bold')"
        aria-label="toggle bold"
        @click="editor!.chain().focus().toggleBold().run()"
      >
        <LazyIconBaselineFormatBold />
      </button>

      <button
        title="CTRL+I"
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('italic') }"
        :aria-pressed="editor.isActive('italic')"
        aria-label="toggle italic"
        @click="editor!.chain().focus().toggleItalic().run()"
      >
        <LazyIconBaselineFormatItalic />
      </button>

      <button
        title="CTRL+E"
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('code') }"
        :aria-pressed="editor.isActive('code')"
        aria-label="toggle code"
        @click="editor!.chain().focus().toggleCode().run()"
      >
        <LazyIconBaselineCode />
      </button>

      <button
        title="CTRL+L"
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('link') }"
        :aria-pressed="editor.isActive('link')"
        aria-label="toggle link"
        @click="(isEditingLink = !isEditingLink)"
      >
        <LazyIconBaselineLink />
      </button>
    </div>

    <form v-else class="formatter__contents-wrapper" @submit.prevent="saveEditingLink">
      <input
        v-model="editingLink"
        type="url"
        class="formatter__input"
        :placeholder="linkInputPlaceholder"
        enterkeyhint="done"
        @keydown.esc="hideLinkInput"
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

    transition-delay: .1s;
  }

  &__input {
    align-self: stretch;

    font: inherit;
    font-size: 0.9rem;
    line-height: 0.5;
    color: var(--text-color);

    width: 100vw;
    max-width: 27ch;

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

      @media (max-width: 365px) {
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
