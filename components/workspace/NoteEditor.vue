<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';
import StarterKir from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

interface Props { content: string }
interface Emits { (event: 'update', content: string): void }
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const update = (content: string) => emit('update', content);

const editor = useEditor({
  autofocus: 'start',
  content: props.content,
  extensions: [
    StarterKir,
    Link,
    TaskList,
    TaskItem,
    Placeholder.configure({
      placeholder: ({ editor }) =>
        editor.isEmpty ? 'Start with heading...' : 'Write something...',
    }),
  ],

  onUpdate: useDebounceFn(({ editor }) => {
    update(editor.isEmpty ? '' : editor.getHTML());
  }, 400),
});

// if user updated current note and switched to another note
// before debounced function execution, try to save content
onBeforeRouteUpdate(() => {
  const noteContent = editor.value?.isEmpty ? '' : editor.value?.getHTML();
  update(noteContent || '');
});
</script>

<template>
  <EditorContent class="note-editor" :editor="editor" />
</template>

<style lang="scss">
.note-editor {
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
      padding: 0.5rem 0;
      padding-left: 1.5rem;

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
          }

          > div {
            flex: 1 1 auto;
          }
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
        padding: 0.75rem 0;
      }
    }

    & > * + * {
      margin-top: 0.5rem;
    }

    * {
      transition: all .3s;
    }
  }
}
</style>
