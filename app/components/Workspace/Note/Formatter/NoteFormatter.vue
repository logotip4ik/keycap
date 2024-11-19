<script setup lang="ts">
import type { ChainedCommands, Editor } from '@tiptap/core';
import type { Level } from '@tiptap/extension-heading';

import { LinkInputPlaceholder, makeMarks } from './config';

const props = defineProps<{
  editor: Editor
}>();

const formatterEl = shallowRef<HTMLElement | null>(null);

const linkInputPlaceholder = ref(LinkInputPlaceholder.INITIALLY_EMPTY);
const isEditingLink = ref(false);
const editingLink = ref('');

const marks = makeMarks(props);

const headingLevels = [1, 2, 3];
const activeHeadingLevel = computed(() => {
  for (const level of headingLevels) {
    if (props.editor.isActive('heading', { level })) {
      return level;
    }
  }

  return 1;
});

const modKey = useModKey();
const { setting: formatterPosition } = useSetting(settings.formatterPosition);

let prevListItem: string | undefined;
let prevHeadingLevel: number | undefined;
const prevSelection = { start: -1, end: -1 };

let prevContainerWidth: number;
function rememberContainer(el: Element) {
  prevContainerWidth = getElementWidth(el.parentElement);
}

function animateContainer(el: Element) {
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

function closeLinkEditing() {
  isEditingLink.value = false;
  resetSelection();
}

function saveEditingLink() {
  if (!editingLink.value) {
    props.editor.commands.unsetLink();
  }
  else {
    props.editor.commands.setLink({ href: editingLink.value });
  }

  closeLinkEditing();
}

function toggleHeading() {
  let actionIdx = 0;

  const commands = props.editor.chain().focus();

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
  const { selection } = props.editor.state;

  if (formatterEl.value && props.editor.isFocused && !selection.empty) {
    event.preventDefault();
    (formatterEl.value.firstElementChild as HTMLElement | undefined)?.focus();
  }
}

function focusEditor(event: KeyboardEvent) {
  if (formatterEl.value?.contains(event.target as HTMLElement)) {
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

  '$mod+Shift+l': (event) => {
    const { selection } = props.editor.state;

    if ((props.editor.isFocused && !selection.empty) || isEditingLink.value) {
      event.preventDefault();

      isEditingLink.value = !isEditingLink.value;

      if (!isEditingLink.value) {
        resetSelection();
      }
    }
  },
});

let prevTextSelection: string | undefined;
watch(() => props.editor.state.selection, (selection) => {
  const textSelection = selection.empty ? '' : props.editor.state.doc.textBetween(selection.from, selection.to, '');

  if (prevTextSelection && prevTextSelection !== textSelection) {
    isEditingLink.value = false;
    prevListItem = undefined;
    prevHeadingLevel = undefined;
  }

  prevTextSelection = textSelection;
});

useFocusTrap(formatterEl);
</script>

<template>
  <WithFadeTransition @before-leave="rememberContainer" @enter="animateContainer">
    <div v-if="!isEditingLink" ref="formatterEl" class="formatter__contents-wrapper">
      <WithTooltip>
        <template #default="{ ref, tooltipId }">
          <button
            :ref
            class="formatter__button"
            :class="{ 'formatter__button--active': editor.isActive('heading') }"
            aria-label="cycle heading"
            :aria-pressed="editor.isActive('heading')"
            :aria-describedby="tooltipId"
            @click="toggleHeading"
          >
            <Icon :path="`heading-${activeHeadingLevel}`" />
          </button>
        </template>

        <template #tooltip>
          <!-- TODO: show different number depending on current heading level -->
          <kbd>{{ modKey }}+Alt+1</kbd>
        </template>
      </WithTooltip>

      <WithTooltip>
        <template #default="{ ref, tooltipId }">
          <button
            :ref
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
            <Icon path="list" />
          </button>
        </template>

        <template #tooltip>
          <kbd>{{ modKey }}+Shift+8</kbd>
        </template>
      </WithTooltip>

      <WithTooltip>
        <template #default="{ ref, tooltipId }">
          <button
            :ref
            class="formatter__button"
            :class="{ 'formatter__button--active': editor.isActive('blockquote') }"
            aria-label="toggle blockquote"
            :aria-pressed="editor.isActive('blockquote')"
            :aria-describedby="tooltipId"
            @click="editor.chain().focus().toggleBlockquote().run()"
          >
            <Icon path="double-quotes-r" />
          </button>
        </template>

        <template #tooltip>
          <kbd>{{ modKey }}+Shift+B</kbd>
        </template>
      </WithTooltip>

      <WithTooltip>
        <template #default="{ ref, tooltipId }">
          <button
            :ref
            class="formatter__button"
            :class="{ 'formatter__button--active': editor.isActive('link') }"
            aria-label="toggle link"
            :aria-pressed="editor.isActive('link')"
            :aria-describedby="tooltipId"
            @click="isEditingLink = !isEditingLink"
          >
            <Icon path="baseline-link" />
          </button>
        </template>

        <template #tooltip>
          <kbd>{{ modKey }}+Shift+L</kbd>
        </template>
      </WithTooltip>

      <div class="formatter__vr" aria-hidden="true" />

      <WithTooltip v-for="(mark, i) in marks" :key="i">
        <template #default="{ ref, tooltipId }">
          <button
            :ref
            class="formatter__button"
            :class="{ 'formatter__button--active': unref(mark.isActive) }"
            :aria-label="mark.ariaLabel"
            :aria-pressed="unref(mark.isActive)"
            :aria-describedby="tooltipId"
            @click="mark.onClick"
          >
            <Icon :path="mark.icon" />
          </button>
        </template>

        <template #tooltip>
          <kbd>{{ mark.shortcut }}</kbd>
        </template>
      </WithTooltip>
    </div>

    <form v-else class="formatter__contents-wrapper formatter__contents-wrapper__form" @submit.prevent="saveEditingLink">
      <input
        v-model="editingLink"
        type="url"
        class="formatter__input"
        :placeholder="linkInputPlaceholder"
        enterkeyhint="done"
        pattern="https?://.+?"
        @keydown.esc.stop="closeLinkEditing"
      >

      <button class="formatter__button" type="submit">
        <Icon path="baseline-check" />
      </button>
    </form>
  </WithFadeTransition>
</template>

<style lang="scss">
.formatter {
  --items-spacing: 0.5rem;

  &__vr {
    align-self: stretch;

    background-color: hsla(var(--text-color-hsl), 0.1);
  }

  &__contents-wrapper {
    --button-size: minmax(1.5rem, 1fr);
    --form-columns: 10;

    display: grid;
    align-items: center;
    gap: var(--items-spacing);
    grid-template-columns: repeat(4, var(--button-size)) 1px repeat(auto-fit, var(--button-size));

    width: 99vw;
    max-width: 22rem;

    &__form {
      grid-template-columns: repeat(var(--form-columns), var(--button-size));
      max-width: calc(24rem - 2px);
    }

    @media screen and (max-width: $breakpoint-tablet) {
      max-width: 28rem;

      &__form {
        --form-columns: 9;
      }
    }
  }

  &__input {
    grid-column: 1 / var(--form-columns);
    align-self: stretch;

    font: inherit;
    font-size: 0.9rem;
    line-height: 0.5;
    color: var(--text-color);

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
  }

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    font-size: 1rem;
    color: hsla(var(--text-color-hsl), 0.5);

    width: 100%;
    height: auto;
    aspect-ratio: 1/1;

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

      width: 75%;
      height: auto;
    }
  }

  &.inline-menu {
    .formatter {
      &__wrapper {
        justify-content: center;
      }
    }
  }
}

.firefox .formatter svg {
  // idk why, but firefox is rendering bigger svgs then other, or chrome and safari rendering
  // smaller then needed...
  width: 60%;
}
</style>
