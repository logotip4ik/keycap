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
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Code from '@tiptap/extension-code';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import BubbleMenuPlugin from '@tiptap/extension-bubble-menu';
import CodeBlock from '@tiptap/extension-code-block';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';

import {
  LazyWorkspaceNoteFormatterBubbleBox as LazyBubbleBox,
  LazyWorkspaceNoteFormatterFixedBox as LazyFixedBox,
} from '#components';

interface Props {
  content: string
  editable: boolean
  onUpdate: (content: string) => void
}
const props = defineProps<Props>();

const mitt = useMitt();

const isSmallScreen = inject(IsSmallScreenKey)!;

// TODO: export this whole mess into separate file
const editor = useEditor({
  autofocus: !isSmallScreen && 'start', // disable auto focus on small screens
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
    Placeholder.configure({
      placeholder: ({ editor }) =>
        editor.isEmpty ? ' # Start with heading...' : 'Write something...',
    }),
  ],

  onUpdate: debounce(() => {
    saveEditorContent();
  }, 350),
});

function update(content: string) {
  props.onUpdate(content);
}

function saveEditorContent() {
  const noteContent = editor.value?.isEmpty ? '' : editor.value?.getHTML();

  update(noteContent || '');
}

function hideBubbleMenu() {
  const { from } = editor.value!.state.selection;

  editor.value!.commands.focus(from, { scrollIntoView: false });
}

mitt.on('save:note', saveEditorContent);

// tiptap editor does not handle content change
watch(() => props.content, (content) => {
  const editorContent = editor.value?.getHTML();

  if (editorContent !== content)
    editor.value?.commands.setContent(content);
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

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="note-editor__wrapper">
    <!-- TODO: vue does not like when this two elements change
      (even without lazy)
     -->
    <LazyBubbleBox
      v-if="editor && !isSmallScreen"
      :editor="editor"
    >
      <WorkspaceNoteFormatter :editor="editor" @hide="hideBubbleMenu" />
    </LazyBubbleBox>

    <LazyFixedBox
      v-else-if="editor && isSmallScreen"
      :editor="editor"
    >
      <WorkspaceNoteFormatter :editor="editor" @hide="() => null" />
    </LazyFixedBox>

    <EditorContent class="note-editor" :editor="editor" />
  </div>
</template>
