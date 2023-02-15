<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';

import StarterKir from '@tiptap/starter-kit';
import Code from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import BubbleMenuPlugin from '@tiptap/extension-bubble-menu';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlock from '@tiptap/extension-code-block';

interface Props { content: string; editable: boolean }
interface Emits { (event: 'update', content: string): void; (event: 'refresh'): void }
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const mitt = useMitt();

const update = (content: string) => emit('update', content);

const editor = useEditor({
  autofocus: window.innerWidth > 740 && 'start', // disable auto focus on small screens
  content: props.content,
  editable: props.editable,
  extensions: [
    StarterKir.configure({ code: false, codeBlock: false }),
    Link,
    TaskList,
    TaskItem,
    BubbleMenuPlugin,
    Code.configure({
      HTMLAttributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'none',
        spellcheck: 'false',
      },
    }),
    // TODO: https://tiptap.dev/api/nodes/code-block-lowlight
    CodeBlock.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          autocomplete: { default: 'off' },
          autocorrect: { default: 'off' },
          autocapitalize: { default: 'none' },
          spellcheck: { default: 'false' },
        };
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right'],
    }),
    Placeholder.configure({
      placeholder: ({ editor }) =>
        editor.isEmpty ? ' # Start with heading...' : 'Write something...',
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

function handleVisibilityChange() {
  if (document.visibilityState === 'visible')
    emit('refresh');
  else if (document.visibilityState === 'hidden')
    saveEditorContent();
}

function hideBubbleMenu() {
  const { from } = editor.value!.state.selection;

  editor.value!.commands.focus(from, { scrollIntoView: false });
}

mitt.on('save:note', saveEditorContent);

// tiptap editor does not handle content change
watch(() => props.content, (content) => {
  const editorContent = editor.value?.getHTML();

  if (editorContent !== content) editor.value?.commands.setContent(content);
});

watch(() => props.editable, (editable) => {
  if (!editor.value) return;

  if (editor.value.options.editable !== editable)
    editor.value?.setOptions({ editable });
}, { immediate: true });

useTinykeys({
  '$mod+s': (event) => {
    if (!editor.value?.isFocused) return;

    event.preventDefault();

    const noteContent = editor.value?.isEmpty ? '' : editor.value?.getHTML();

    update(noteContent || '');
  },
});

onMounted(() => {
  window.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('visibilitychange', handleVisibilityChange);
});

// if user updated current note and switched to another note
// before debounced function execution, try to save content
onBeforeRouteUpdate(() => {
  saveEditorContent();
});
</script>

<template>
  <div class="note-editor__wrapper">
    <template v-if="editor">
      <WorkspaceNoteEditorBubbleMenu :editor="editor" @hide="hideBubbleMenu" />
    </template>

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
    line-height: 1.35;

    min-height: 100%;

    padding: 12.5vh 1.5rem 25vh;

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

          transition: opacity .3s;

          &[data-checked="true"] {
            opacity: 0.625;
            filter: blur(1px);
          }

          > label {
            flex: 0 0 auto;

            margin-right: 0.5rem;
            user-select: none;

            input {
              cursor: pointer;

              accent-color: var(--task-list-indicator-color);

              transform: scale(1.125);
              transform-origin: center center;
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

    @media screen and (max-width: $breakpoint-tablet) {
      padding: 1rem 1rem 45vh;
    }
  }
}
</style>
