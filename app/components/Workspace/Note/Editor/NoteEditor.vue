<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

import {
  LazyWorkspaceNoteFormatterBubbleBox as LazyBubbleBox,
  LazyWorkspaceNoteFormatterFixedBox as LazyFixedBox,
} from '#components';
import { Step } from '@tiptap/pm/transform';
import { EditorContent } from '@tiptap/vue-3';

import '~/assets/styles/note-editor.scss';

const props = defineProps<{
  note: NoteWithContent
  editable: boolean
  onUpdate: (content: string, force?: boolean) => Promise<void>
  onRefresh: () => Promise<void>
}>();

const content = computed(() => props.note.content || '');

const { shortcuts } = useAppConfig();
const mitt = useMitt();
const zeenk = useZeenk();
const { isSmallScreen } = useDevice();
const { setting: spellcheck } = useSetting(settings.spellcheck);

let hasUnsavedChanges = false;
const { editor } = useTiptap({
  content,
  spellcheck,
  editable: () => props.editable,
  onUpdate: ({ transaction }) => {
    if (transaction.getMeta('websocket') === true) {
      return;
    }

    hasUnsavedChanges = true;
    const updatePromise = updateContent();

    if (transaction.getMeta('paste') === true) {
      updatePromise.then(() => {
        zeenk.send('update-note', { path: props.note.path });
      });

      return;
    }

    zeenk.send('update-note', {
      path: props.note.path,
      steps: transaction.steps.map((s) => s.toJSON()),
    });
  },
});

mitt.on('save:note', () => updateContent(true));

zeenk.on('update-note', ({ path, steps }) => {
  if (props.note.path !== path || !editor) {
    return;
  }

  if (!steps) {
    props.onRefresh();
    return;
  }

  const tr = editor.state.tr;
  tr.setMeta('websocket', true);

  for (const step of steps) {
    tr.step(
      Step.fromJSON(editor.state.schema, step),
    );
  }

  editor.view.dispatch(tr);
});

function updateContent(force?: boolean) {
  const content = editor.getHTML();

  return props
    .onUpdate(content || '', force)
    .then(() => {
      hasUnsavedChanges = false;
    });
}

function saveUnsavedChanges() {
  if (hasUnsavedChanges) {
    updateContent(true);
  }
}

useTinykeys({
  [shortcuts.edit]: (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName !== 'INPUT' && target !== editor.view.dom) {
      event.preventDefault();
      editor.commands.focus();
    }
  },

  'Escape': () => {
    editor.commands.blur();
  },

  '$mod+s': (event) => {
    if (!editor.isFocused) {
      return;
    }

    event.preventDefault();

    updateContent();
  },
});

if (import.meta.client) {
  const offVisibilityChange = on(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveUnsavedChanges();
    }
  });

  onBeforeUnmount(() => {
    offVisibilityChange();
    saveUnsavedChanges();
  });
}
</script>

<template>
  <div class="note-editor__wrapper">
    <Component
      :is="isSmallScreen ? LazyFixedBox : LazyBubbleBox"
      v-if="editor"
      :editor
    >
      <WorkspaceNoteFormatter :editor />
    </Component>

    <EditorContent class="note-editor" :editor="editor as Editor" />
  </div>
</template>
