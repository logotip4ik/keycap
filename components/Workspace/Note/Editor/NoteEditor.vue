<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

import {
  LazyWorkspaceNoteFormatterBubbleBox as LazyBubbleBox,
  LazyWorkspaceNoteFormatterFixedBox as LazyFixedBox,
} from '#components';
import { history } from '@tiptap/pm/history';
import { Step } from '@tiptap/pm/transform';
import { EditorContent } from '@tiptap/vue-3';

import '~/assets/styles/note-editor.scss';

const props = defineProps<{
  note: NoteWithContent
  editable: boolean
  onUpdate: (content: string, force?: boolean) => Promise<void>
  onRefresh: () => Promise<void>
}>();

const { shortcuts } = useAppConfig();
const mitt = useMitt();
const zeenk = useZeenk();
const { isSmallScreen } = useDevice();
const { setting: spellcheck } = useSetting(settings.spellcheck);
const {
  editor,
  isTyping,
  onUpdate: onContentUpdate,
} = useTiptap();

let hasUnsavedChanges = false;
function updateContent(force?: boolean) {
  const content = editor.getHTML();

  return props
    .onUpdate(content || '', force)
    .then(() => {
      hasUnsavedChanges = false;
    });
}

watch(() => props.note.content, (content) => {
  if (isTyping.value || !editor) {
    return;
  }

  const editorContent = editor.getHTML();

  if (editorContent !== content) {
    editor.commands.setContent(content || '');
  }
}, {
  immediate: import.meta.client,
  deep: true, // this is really weird, but it only triggers watcher with deep: true ?
});

watch(() => props.editable, (editable) => {
  editor.setOptions({ editable });
}, { immediate: import.meta.client });

watch(spellcheck, (spellcheck) => {
  editor.setOptions({
    editorProps: {
      attributes: {
        ...editor.options.editorProps.attributes,
        spellcheck: spellcheck === 'yes' ? 'true' : 'false',
      },
    },
  });
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

function saveUnsavedChanges() {
  if (hasUnsavedChanges) {
    updateContent(true);
  }
}

onContentUpdate(({ transaction }) => {
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
});

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
  withTiptapEditor((editor) => {
    editor.unregisterPlugin('history');
    editor.registerPlugin(history());
  });

  const offUnload = on(window, 'beforeunload', saveUnsavedChanges, { passive: true });

  onBeforeUnmount(() => {
    saveUnsavedChanges();
    offUnload();

    // If user navigates right after keypress, `isTyping` could be true on next
    // render of NoteEditor component, and so content watcher will not update
    // editor's content. This prevents such case by explicitly setting `isTyping`
    // to false after unmounting
    isTyping.value = false;
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
