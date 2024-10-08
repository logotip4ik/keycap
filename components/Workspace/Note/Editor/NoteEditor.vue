<script setup lang="ts">
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

function updateContent(force?: boolean) {
  const content = editor.value?.getHTML();

  return props.onUpdate(content || '', force);
}

watch(() => props.note.content, (content) => {
  if (isTyping.value || !editor.value) {
    return;
  }

  const editorContent = editor.value.getHTML();

  if (editorContent !== content) {
    editor.value.commands.setContent(content || '');
  }
}, {
  immediate: import.meta.client,
  deep: true, // this is really weird, but it only triggers watcher with deep: true ?
});

watch(() => props.editable, (editable) => {
  editor.value?.setOptions({ editable });
}, { immediate: import.meta.client });

watch(spellcheck, (spellcheck) => {
  editor.value?.setOptions({
    editorProps: {
      attributes: {
        ...editor.value.options.editorProps.attributes,
        spellcheck: spellcheck === 'yes' ? 'true' : 'false',
      },
    },
  });
});

mitt.on('save:note', () => updateContent());

zeenk.on('update-note', ({ path, steps }) => {
  if (props.note.path !== path || !editor.value) {
    return;
  }

  if (!steps) {
    props.onRefresh();
    return;
  }

  const tr = editor.value.state.tr;
  tr.setMeta('websocket', true);

  for (const step of steps) {
    tr.step(
      Step.fromJSON(editor.value.state.schema, step),
    );
  }

  editor.value.view.dispatch(tr);
});

onContentUpdate(({ transaction }) => {
  if (transaction.getMeta('websocket') === true) {
    return;
  }

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

    if (target.tagName !== 'INPUT' && target !== editor.value?.view.dom) {
      event.preventDefault();
      editor.value?.commands.focus();
    }
  },

  'Escape': () => {
    editor.value?.commands.blur();
  },

  '$mod+s': (event) => {
    if (!editor.value?.isFocused) {
      return;
    }

    event.preventDefault();

    updateContent();
  },
});

if (import.meta.client) {
  const offUnload = on(window, 'beforeunload', () => {
    updateContent(true);
  }, { passive: true });

  onBeforeUnmount(() => {
    offUnload();

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

    <EditorContent class="note-editor" :editor />
  </div>
</template>
