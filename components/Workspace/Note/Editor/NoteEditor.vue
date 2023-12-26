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
  isTyping,
  onUpdate: onContentUpdate,
  setOptions: setEditorOptions,
  setContent: setEditorContent,
} = useTiptap();

function updateContent(html?: string) {
  const content = editor.value?.isEmpty ? '' : (html || editor.value?.getHTML() || '');

  props.onUpdate(content);
}

function hideBubbleMenu() {
  const { from } = editor.value!.state.selection;

  editor.value!.commands.focus(from, { scrollIntoView: false });
}

watch(() => props.content, (content) => {
  const editorContent = editor.value?.getHTML();

  if (editorContent !== content && !isTyping.value)
    setEditorContent(content);
}, { immediate: import.meta.client });

watch(() => props.editable, (editable) => {
  if (!editor.value)
    return;

  if (editor.value.options.editable !== editable)
    setEditorOptions({ editable });
}, { immediate: import.meta.client });

mitt.on('save:note', () => updateContent());

// FIX:if user navigates right after keypress? then new content will be overwritten by user ?

onContentUpdate(() => updateContent());

useTinykeys({
  '$mod+s': (event) => {
    if (!editor.value?.isFocused)
      return;

    event.preventDefault();

    updateContent();
  },
});
</script>

<template>
  <div class="note-editor__wrapper">
    <Component
      :is="isSmallScreen ? LazyFixedBox : LazyBubbleBox"
      v-if="editor"
      :editor="editor"
    >
      <WorkspaceNoteFormatter
        :editor="editor"
        @hide="isSmallScreen ? NOOP : hideBubbleMenu"
      />
    </Component>

    <EditorContent class="note-editor" :editor="editor" />
  </div>
</template>
