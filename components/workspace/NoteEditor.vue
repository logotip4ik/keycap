<script setup lang="ts">
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

import { BubbleMenu, EditorContent, useEditor } from '@tiptap/vue-3';

import StarterKir from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import BubbleMenuPlugin from '@tiptap/extension-bubble-menu';

interface Props { content: string }
interface Emits { (event: 'update', content: string): void }
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const update = (content: string) => emit('update', content);

const editor = useEditor({
  autofocus: window.innerWidth > 740 && 'start', // disable auto focus on small screens
  content: props.content,
  extensions: [
    StarterKir,
    Link,
    TaskList,
    TaskItem,
    BubbleMenuPlugin,
    Placeholder.configure({
      placeholder: ({ editor }) =>
        editor.isEmpty ? 'Start with heading...' : 'Write something...',
    }),
  ],

  onUpdate: useDebounceFn(({ editor }) => {
    update(editor.isEmpty ? '' : editor.getHTML());
  }, 400),
});

// tiptap editor does not handle content change
watch(() => props.content, (content) => {
  const editorContent = editor.value?.getHTML();

  if (editorContent !== content) editor.value?.commands.setContent(content);
});

// if user updated current note and switched to another note
// before debounced function execution, try to save content
onBeforeRouteUpdate(() => {
  const noteContent = editor.value?.isEmpty ? '' : editor.value?.getHTML();
  update(noteContent || '');
});
</script>

<template>
  <div class="note-editor__wrapper">
    <!-- TODO: separate bubble menu into another file ? -->
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :tippy-options="{ duration: [10, 150], offset: [0, 5], animation: 'shift-away', arrow: false }"
      class="note-editor__bubble-menu"
    >
      <button
        class="note-editor__bubble-menu__button"
        :class="{ 'note-editor__bubble-menu__button--active': editor.isActive('bold') }"
        @click="editor!.chain().focus().toggleBold().run()"
      >
        <Icon name="ic:baseline-format-bold" />
      </button>
      <button
        class="note-editor__bubble-menu__button"
        :class="{ 'note-editor__bubble-menu__button--active': editor.isActive('italic') }"
        @click="editor!.chain().focus().toggleItalic().run()"
      >
        <Icon name="ic:baseline-format-italic" />
      </button>
      <button
        class="note-editor__bubble-menu__button"
        :class="{ 'note-editor__bubble-menu__button--active': editor.isActive('strike') }"
        @click="editor!.chain().focus().toggleStrike().run()"
      >
        <Icon name="ic:baseline-format-strikethrough" />
      </button>
    </BubbleMenu>
    <EditorContent class="note-editor" :editor="editor" />
  </div>
</template>

<style lang="scss">
.note-editor {
  height: 100%;

  &__wrapper {
    height: 100%;
  }

  &__bubble-menu {
    &__button {
      --size-basis: 1.75rem;

      & + & {
        margin-left: 0.5rem;
      }

      font-size: 1rem;
      color:hsla(var(--text-color-hsl), 0.5);

      width: var(--size-basis);
      height: var(--size-basis);

      appearance: none;
      background-color: transparent;
      border: 1px solid hsla(var(--text-color-hsl), 0.5);
      border-radius: .25rem;

      cursor: pointer;
      transition: color .3s, border .3s, background-color .3s;

      &:is(:hover, :focus) {
        color: hsla(var(--text-color-hsl), 1);

        border: 1px solid hsla(var(--text-color-hsl), 0.75);
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
    }
  }

  .ProseMirror {
    font-size: 105%;

    min-height: 100%;

    padding: 0.75rem .75rem 0;

    outline: none;

    p, pre {
      margin: 0;

      padding: 0.5rem 0;

      &.is-empty::before {
        content: attr(data-placeholder);
        float: left;
        color: hsla(var(--text-color-hsl), 0.25);
        pointer-events: none;
        height: 0;
      }
    }

    ul, ol {
      margin: 0;
      padding: 0.4rem 0;
      padding-left: 1rem;

      &[data-type="taskList"] {
        list-style: none;

        p {
          margin: 0;
          padding: 0;
        }

        li {
          display: flex;

          > label {
            flex: 0 0 auto;

            margin-right: 0.5rem;
            user-select: none;

            input {
              cursor: pointer;
            }
          }

          > div {
            flex: 1 1 auto;
          }
        }

        li + li {
          margin-top: 0.175rem;
        }
      }
    }

    code {
      font-size: 0.9rem;
      color: var(--text-color);

      padding: 0.175rem 0.25rem;

      border-radius: 0.25rem;
      background-color: hsla(var(--text-color-hsl), 0.1);
      box-decoration-break: clone;
    }

    li {
      & > p {
        padding: 0.25rem 0;
      }
    }

    em {
      font-variation-settings: "ital" 10;
    }

    a {
      color: currentColor;
      cursor: pointer;
    }

    @for $i from 1 to 7 {
      h#{$i} {
        margin: 0;
        padding: 1rem 0 0.5rem;

        &:not(:first-child) {
          padding-top: 2rem;
        }
      }
    }

    * {
      transition: all .3s;
    }
  }
}
</style>
