<script setup lang="ts">
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

import { BubbleMenu } from '@tiptap/vue-3';

import type { Editor } from '@tiptap/vue-3';
import type { Props as TippyProps } from 'tippy.js';

interface Props { editor: Editor }
const props = defineProps<Props>();

const isEditingLink = ref(false);
const editingLink = ref('');
const { width } = useWindowSize();
const isPhoneScreen = computed(() => width.value < 740);

const tippyOptions: Partial<TippyProps> = {
  zIndex: 9,
  duration: [50, 150],
  theme: 'adaptive',
  animation: 'shift-away',
  arrow: false,
  placement: isPhoneScreen.value ? 'bottom' : 'top',
  onHidden: () => isEditingLink.value = false,
};

let prevContainerWidth = '';
function beforeLeaveAnimation(el: HTMLElement) {
  prevContainerWidth = `${el.parentElement?.clientWidth || 0}px`;
}

function enterAnimation(el: HTMLElement) {
  const currentWidth = el.parentElement?.clientWidth || 0;

  el.parentElement?.animate(
    [{ width: prevContainerWidth }, { width: `${currentWidth}px` }],
    { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  );

  if (!isEditingLink.value) return;

  const activeUrl = props.editor.isActive('link')
    ? props.editor.getAttributes('link').href || ''
    : '';

  editingLink.value = activeUrl;

  nextTick(() => {
    el.querySelector('input')?.focus();
  });
}

function saveEditingLink() {
  if (editingLink.value !== '') {
    const mark = props.editor.schema.mark('link', { href: editingLink.value });

    const { from, to } = props.editor.state.selection;
    props.editor.view.dispatch(
      props.editor.view.state.tr
        .addMark(from, to, mark),
    );
  }
  else {
    props.editor.commands.unsetLink();
  }

  isEditingLink.value = false;
}

useTinykeys({
  '$mod+l': (event) => {
    const { from, to } = props.editor.state.selection;

    if (props.editor.isFocused && to - from <= 0) return;

    event.preventDefault();

    isEditingLink.value = !isEditingLink.value;
  },
});
</script>

<template>
  <BubbleMenu
    :editor="editor"
    :tippy-options="tippyOptions"
    class="note-editor__bubble-menu"
  >
    <Transition name="bubble-menu-fade" @before-leave="beforeLeaveAnimation" @enter="enterAnimation">
      <div v-if="!isEditingLink">
        <button
          title="CTRL+B"
          class="note-editor__bubble-menu__button"
          :class="{ 'note-editor__bubble-menu__button--active': editor.isActive('bold') }"
          @click="editor!.chain().focus().toggleBold().run()"
        >
          <Icon name="ic:baseline-format-bold" />
        </button>
        <button
          title="CTRL+I"
          class="note-editor__bubble-menu__button"
          :class="{ 'note-editor__bubble-menu__button--active': editor.isActive('italic') }"
          @click="editor!.chain().focus().toggleItalic().run()"
        >
          <Icon name="ic:baseline-format-italic" />
        </button>
        <button
          title="CTRL+SHIFT+X"
          class="note-editor__bubble-menu__button"
          :class="{ 'note-editor__bubble-menu__button--active': editor.isActive('strike') }"
          @click="editor!.chain().focus().toggleStrike().run()"
        >
          <Icon name="ic:baseline-format-strikethrough" />
        </button>
        <button
          title="CTRL+E"
          class="note-editor__bubble-menu__button"
          :class="{ 'note-editor__bubble-menu__button--active': editor.isActive('code') }"
          @click="editor!.chain().focus().toggleCode().run()"
        >
          <Icon name="ic:baseline-code" />
        </button>
        <button
          title="CTRL+L"
          class="note-editor__bubble-menu__button"
          :class="{ 'note-editor__bubble-menu__button--active': editor.isActive('link') }"
          @click="(isEditingLink = !isEditingLink)"
        >
          <Icon name="ic:baseline-link" />
        </button>
      </div>

      <form v-else class="note-editor__bubble-menu__link-wrapper" @submit.prevent="saveEditingLink">
        <input
          v-model="editingLink"
          type="url"
          class="note-editor__bubble-menu__input"
          placeholder="hit enter to remove link"
        >

        <button class="note-editor__bubble-menu__button" type="submit">
          <Icon name="ic:baseline-check" />
        </button>
      </form>
    </Transition>
  </BubbleMenu>
</template>

<style lang="scss">
.note-editor__bubble-menu {
  --items-spacing: 0.5rem;

  &__link-wrapper {
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

    width: 100%;

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
  }

  &__button {
    --size-basis: 2rem;

    & + & {
      margin-left: var(--items-spacing);
    }

    flex-shrink: 0;

    font-size: 1rem;
    color: hsla(var(--text-color-hsl), 0.5);

    width: var(--size-basis);
    height: var(--size-basis);

    appearance: none;
    background-color: transparent;
    border: 1px solid hsla(var(--text-color-hsl), 0.5);
    border-radius: .25rem;

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

    @media screen and (max-width: $breakpoint-tablet) {
      --size-basis: 2.5rem;
    }
  }
}

.tippy-box[data-theme~='adaptive'] {
  background-color: hsla(var(--surface-color-hsl), 0.95);

  box-shadow:
    1px 1.7px 5.3px rgba(0, 0, 0, 0.032),
    3.4px 5.6px 17.9px rgba(0, 0, 0, 0.048),
    15px 25px 80px rgba(0, 0, 0, 0.08)
  ;

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.65);

    backdrop-filter: blur(0.4rem);
  }
}

.bubble-menu-fade-enter-active,
.bubble-menu-fade-leave-active {
  transition: opacity .4s;
}

.bubble-menu-fade-leave-active {
  display: none;
}

.bubble-menu-fade-enter-from,
.bubble-menu-fade-leave-to {
  opacity: 0;
}
</style>
