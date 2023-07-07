<script setup lang="ts">
import type { ChainedCommands, Editor } from '@tiptap/core';
import type { Level } from '@tiptap/extension-heading';

interface Props { editor: Editor; onHide: () => void }

const props = defineProps<Props>();

const isEditingLink = ref(false);
const editingLink = ref('');

let prevListItem: string | undefined;
let prevHeadingLevel: number | undefined;

let prevContainerWidth = '';

function beforeLeaveAnimation(el: Element) {
  prevContainerWidth = `${el.parentElement?.offsetWidth || 0}px`;
}

function enterAnimation(el: Element) {
  const currentContainerWidth = `${el.parentElement?.offsetWidth || 0}px`;

  el.parentElement?.animate(
    [{ width: prevContainerWidth }, { width: currentContainerWidth }],
    { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  );

  if (!isEditingLink.value) return;

  const activeUrl = props.editor.isActive('link')
    ? props.editor.getAttributes('link').href
    : '';

  editingLink.value = activeUrl;

  nextTick(() => {
    el.querySelector('input')?.focus();
  });
}

function saveEditingLink() {
  const currentLinkUrl = props.editor.isActive('link')
    ? props.editor.getAttributes('link').href
    : '';

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

  if (currentLinkUrl !== editingLink.value)
    props.onHide();
}

function toggleHeading() {
  let actionIdx = 0;

  const commands = props.editor!.chain().focus();

  for (let i = 0; i < 3; i++) {
    if (props.editor.isActive('heading', { level: i + 1 })) {
      if (prevHeadingLevel === undefined) prevHeadingLevel = i + 1;

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
      if (prevListItem === undefined) prevListItem = list;

      actionIdx = i + 1;
    }
  });

  if (prevListItem && prevListItem !== 'auto') {
    if (prevListItem === 'taskList') commands.toggleTaskList().run();
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

    if (props.editor.isFocused && to - from <= 0) return;

    event.preventDefault();

    isEditingLink.value = !isEditingLink.value;
  },
});

// NOTE: this is needed for correct cycle effect of text formatting
let prevAnchor: any;
watch(() => props.editor.state.selection.$anchor, (anchor) => {
  const currentTextContent = anchor.node(anchor.depth).textContent;
  const prevTextContent = prevAnchor && prevAnchor.node(prevAnchor.depth).textContent;

  const whitespaceChanged
    = !!prevAnchor
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
  <Transition name="formatter-fade" @before-leave="beforeLeaveAnimation" @enter="enterAnimation">
    <div v-if="!isEditingLink" class="formatter__contents-wrapper">
      <button
        class="formatter__button"
        :class="{
          'formatter__button--active': editor.isActive('heading'),
        }"
        @click="toggleHeading"
      >
        <Icon v-if="editor.isActive('heading', { level: 1 })" name="lucide:heading-1" />
        <Icon v-else-if="editor.isActive('heading', { level: 2 })" name="lucide:heading-2" />
        <Icon v-else-if="editor.isActive('heading', { level: 3 })" name="lucide:heading-3" />
        <Icon v-else name="lucide:heading-1" />
      </button>

      <button
        class="formatter__button"
        :class="{
          'formatter__button--active':
            editor.isActive('taskItem') || editor.isActive('listItem'),
        }"
        @click="toggleListItem"
      >
        <Icon name="material-symbols:list" />
      </button>

      <button
        class="formatter__button"
        :class="{
          'formatter__button--active': editor.isActive('blockquote'),
        }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <Icon name="ri:double-quotes-r" />
      </button>

      <div class="formatter__vr" aria-hidden="true" />

      <button
        title="CTRL+B"
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('bold') }"
        @click="editor!.chain().focus().toggleBold().run()"
      >
        <Icon name="ic:baseline-format-bold" />
      </button>

      <button
        title="CTRL+I"
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('italic') }"
        @click="editor!.chain().focus().toggleItalic().run()"
      >
        <Icon name="ic:baseline-format-italic" />
      </button>

      <button
        title="CTRL+E"
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('code') }"
        @click="editor!.chain().focus().toggleCode().run()"
      >
        <Icon name="ic:baseline-code" />
      </button>

      <button
        title="CTRL+L"
        class="formatter__button"
        :class="{ 'formatter__button--active': editor.isActive('link') }"
        @click="(isEditingLink = !isEditingLink)"
      >
        <Icon name="ic:baseline-link" />
      </button>
    </div>

    <form v-else class="formatter__contents-wrapper" @submit.prevent="saveEditingLink">
      <input
        v-model="editingLink"
        type="url"
        class="formatter__input"
        placeholder="hit enter to remove link"
        enterkeyhint="done"
        @keydown.esc="isEditingLink = false"
      >

      <button class="formatter__button" type="submit">
        <Icon name="ic:baseline-check" />
      </button>
    </form>
  </Transition>
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

    @media screen and (max-width: $breakpoint-tablet) {
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

      width: 67.5%;
      height: auto;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      --size-basis: calc(2.25rem + 1.5vw);

      svg {
        width: 55%;
      }

      @media screen and (max-width: 365px) {
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

.formatter-fade-enter-active,
.formatter-fade-leave-active {
  transition: opacity .3s .1s;
}

.formatter-fade-leave-active {
  display: none;
}

.formatter-fade-enter-from,
.formatter-fade-leave-to {
  opacity: 0;
}
</style>
