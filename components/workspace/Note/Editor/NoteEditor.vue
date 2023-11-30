<script setup lang="ts">
import '~/assets/styles/note-editor.scss';

import { EditorContent } from '@tiptap/vue-3';

import {
  LazyWorkspaceNoteFormatterBubbleBox as LazyBubbleBox,
  LazyWorkspaceNoteFormatterFixedBox as LazyFixedBox,
} from '#components';

const props = defineProps<{
  content: string
  editable: boolean
  onUpdate: (content: string) => void
}>();

const mitt = useMitt();
const isSmallScreen = getIsSmallScreen();
const {
  editor,
  onUpdate: onContentUpdate,
  setOptions: setEditorOptions,
  setContent: setEditorContent,
} = useTiptap();

function saveEditorContent() {
  const noteContent = editor.value?.isEmpty ? '' : editor.value?.getHTML();

  props.onUpdate(noteContent || '');
}

function hideBubbleMenu() {
  const { from } = editor.value!.state.selection;

  editor.value!.commands.focus(from, { scrollIntoView: false });
}

watch(() => props.content, (content) => {
  const editorContent = editor.value?.getHTML();

  if (editorContent !== content)
    setEditorContent(content);
}, { immediate: true });

watch(() => props.editable, (editable) => {
  if (!editor.value) return;

  if (editor.value.options.editable !== editable)
    setEditorOptions({ editable });
}, { immediate: true });

mitt.on('save:note', saveEditorContent);

onContentUpdate(
  debounce(() => saveEditorContent(), 350),
);

useTinykeys({
  '$mod+s': (event) => {
    if (!editor.value?.isFocused) return;

    event.preventDefault();

    saveEditorContent();
  },
});

onBeforeUnmount(saveEditorContent);
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
