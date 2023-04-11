<script setup lang="ts">
import '~/assets/styles/note-editor.scss';

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
    Heading.configure({ levels: [1, 2, 3] }),
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

function update(content: string) {
  emit('update', content);
}

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
