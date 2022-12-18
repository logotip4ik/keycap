<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';

import StarterKir from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import BubbleMenuPlugin from '@tiptap/extension-bubble-menu';
import TextAlign from '@tiptap/extension-text-align';

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
    // TODO: shortcuts aren't working
    TextAlign.configure({
      alignments: ['left', 'center', 'right'],
    }),
    Placeholder.configure({
      placeholder: ({ editor }) =>
        editor.isEmpty ? 'Start with heading...' : 'Write something...',
    }),
  ],

  onUpdate: useDebounceFn(({ editor }) => {
    update(editor.isEmpty ? '' : editor.getHTML());
  }, 350),
});

function saveEditorContent() {
  const noteContent = editor.value?.isEmpty ? '' : editor.value?.getHTML();

  update(noteContent || '');
}

// tiptap editor does not handle content change
watch(() => props.content, (content) => {
  const editorContent = editor.value?.getHTML();

  if (editorContent !== content) editor.value?.commands.setContent(content);
});

useTinykeys({
  '$mod+s': (event) => {
    if (!editor.value?.isFocused) return;

    event.preventDefault();

    const noteContent = editor.value?.isEmpty ? '' : editor.value?.getHTML();

    update(noteContent || '');
  },
});

onMounted(() => {
  window.addEventListener('visibilitychange', saveEditorContent);
});

onBeforeUnmount(() => {
  window.removeEventListener('visibilitychange', saveEditorContent);
});

// if user updated current note and switched to another note
// before debounced function execution, try to save content
onBeforeRouteUpdate(() => {
  saveEditorContent();
});
</script>

<template>
  <div class="note-editor__wrapper">
    <WorkspaceBubbleMenu v-if="editor" :editor="editor" />

    <EditorContent class="note-editor" :editor="editor" />
  </div>
</template>

<style lang="scss">
.note-editor {
  height: 100%;

  &__wrapper {
    height: 100%;
  }

  .ProseMirror {
    font-size: 105%;

    min-height: 100%;

    padding: 10vh 0.75rem 1rem;

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

              accent-color: var(--task-list-indicator-color);
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
      font-synthesis: none;
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

    @media screen and (max-width: 740px) {
      padding-top: 1rem;
      padding-bottom: 35vh
    }
  }
}
</style>
