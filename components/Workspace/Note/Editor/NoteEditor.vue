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
  onUpdate: (content: string, force?: boolean) => void
}>();

const mitt = useMitt();
const isSmallScreen = getIsSmallScreen();
const {
  editor,
  isTyping,
  onUpdate: onContentUpdate,
} = useTiptap();

function updateContent(force?: boolean) {
  const content = editor.value?.isEmpty ? '' : editor.value?.getHTML();

  props.onUpdate(content || '', force);
}

watch(() => props.content, (content) => {
  if (isTyping.value || !editor.value)
    return;

  const editorContent = editor.value.getHTML();

  if (editorContent !== content)
    editor.value.commands.setContent(content || '');
}, { immediate: import.meta.client });

watch(() => props.editable, (editable) => {
  if (!editor.value)
    return;

  if (editor.value.options.editable !== editable)
    editor.value?.setOptions({ editable });
}, { immediate: import.meta.client });

mitt.on('save:note', () => updateContent());

onContentUpdate(() => updateContent());

useTinykeys({
  '$mod+s': (event) => {
    if (!editor.value?.isFocused)
      return;

    event.preventDefault();

    updateContent();
  },
});

onUnmounted(() => {
  // If user navigates right after keypress, `isTyping` could be true on next
  // render of NoteEditor component, and so content watcher will not update
  // editor's content. This prevents such case by explicitly setting `isTyping`
  // to false after unmounting
  isTyping.value = false;

  // prevent resuse of history between documents
  // probably the worst implementation
  // should have just created new instance of tiptap ?
  if (editor.value && 'history$' in editor.value.state) {
    const history = editor.value.state.history$ as any;

    history.done.eventCount = 0;
    history.done.items.values.length = 0;

    history.undone.eventCount = 0;
    history.undone.items.values.length = 0;

    history.prevTime += 10000;
  }
});
</script>

<template>
  <div class="note-editor__wrapper">
    <Component
      :is="isSmallScreen ? LazyFixedBox : LazyBubbleBox"
      v-if="editor"
      :editor="editor"
    >
      <WorkspaceNoteFormatter :editor="editor" />
    </Component>

    <EditorContent class="note-editor" :editor="editor" />
  </div>
</template>
