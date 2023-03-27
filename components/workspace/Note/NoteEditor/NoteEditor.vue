<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';

import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Code from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import BubbleMenuPlugin from '@tiptap/extension-bubble-menu';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlock from '@tiptap/extension-code-block';
import History from '@tiptap/extension-history';

interface Props { content: string; editable: boolean }
interface Emits { (e: 'update', content: string): void; (e: 'refresh'): void; (e: 'showDetails'): void }
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const mitt = useMitt();

const update = (content: string) => emit('update', content);

// TODO: export this whole mess into separate file
const editor = useEditor({
  autofocus: window.innerWidth > 740 && 'start', // disable auto focus on small screens
  content: props.content,
  editable: props.editable,
  extensions: [
    Document,
    Text,
    Paragraph,
    Blockquote,
    BulletList,
    HardBreak,
    Heading,
    HorizontalRule,
    ListItem,
    OrderedList,
    Bold,
    Italic,
    Strike,
    History,
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

  onUpdate: useDebounceFn(saveEditorContent, 350),
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

    saveEditorContent();
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
onBeforeRouteUpdate((from, to) => {
  if (from.path !== to.path)
    saveEditorContent();
});
</script>

<template>
  <div class="note-editor__wrapper">
    <template v-if="editor">
      <LazyWorkspaceNoteEditorBubbleMenu :editor="editor" @hide="hideBubbleMenu" />
    </template>

    <button class="note-editor__details-button" @click="$emit('showDetails')">
      details
    </button>

    <EditorContent class="note-editor" :editor="editor" />
  </div>
</template>

<style lang="scss">
.note-editor {
  height: 100%;

  &__wrapper {
    position: relative;
    isolation: isolate;
    z-index: 0;

    height: 100%;
  }

  &__details-button {
    position: absolute;
    top: 1rem;
    right: 0;
    z-index: 2;

    font: inherit;
    text-decoration: underline;
    color: hsla(var(--text-color-hsl), 0.5);

    padding: 0.5rem 0.75rem;

    border: none;
    outline-color: transparent;
    background: transparent;
    cursor: pointer;

    transition: color .3s, text-shadow .3s;

    @media screen and (max-width: $breakpoint-tablet) {
      top: 0;
    }

    &:is(:hover, :focus-visible) {
      color: hsla(var(--text-color-hsl), 1);
      text-shadow: 0 0 2rem hsla(var(--text-color-hsl), 1);

      transition-duration: .05s;
    }
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

          transition: opacity .3s, filter .3s;

          &[data-checked="true"] {
            opacity: 0.625;
            filter: blur(0.75px);

            &:is(:hover, :focus-within) {
              opacity: 0.9;
              filter: none;
            }
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
        padding: 0.125rem 0;
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

    blockquote {
      margin-left: 1.25rem;
      padding-left: 0.75rem;

      border-left: 2px solid var(--loading-indicator-color);
      background-color: hsla(var(--text-color-hsl), 0.075);
      box-shadow: 0 0 1rem 0 hsla(var(--selection-bg-color-hsl), 0.075);
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
