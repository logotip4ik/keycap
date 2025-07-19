<script setup lang="ts">
import {
  LazyWorkspaceNoteFormatterBubbleBox as LazyBubbleBox,
  LazyWorkspaceNoteFormatterFixedBox as LazyFixedBox,
} from '#components';
import { Step } from '@tiptap/pm/transform';
import { EditorContent } from '@tiptap/vue-3';

import '~/assets/styles/tiptap.css';
import '~/assets/styles/note-editor.scss';

const props = defineProps<{
  note: NoteWithContent
  editable: boolean
  onUpdate: (content: string, force?: boolean) => Promise<void>
  onRefresh: () => Promise<void>
}>();

const content = computed(() => props.note.content || '');

const showingQuickFind = ref(false);

const { shortcuts } = useAppConfig();
const mitt = useMitt();
const zeenk = useZeenk();
const { isSmallScreen } = useDevice();
const { setting: spellcheck } = useSetting(settings.spellcheck);

const hasUnsavedChanges = { value: false };
const { editor } = useTiptap({
  content,
  spellcheck,
  editable: () => props.editable,
  onUpdate: ({ transaction }) => {
    if (transaction.getMeta('websocket') === true) {
      return;
    }

    hasUnsavedChanges.value = true;
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

  return props.onUpdate(content || '', force);
}

// Function with arguments wouldn't be called in firefox in beforeunload event
// And we need to try use beforeunload, because it is the only thing that works
// without `keepalive: true`.
function saveUnsavedChanges() {
  if (hasUnsavedChanges.value) {
    hasUnsavedChanges.value = false;

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

  [shortcuts.quickFind]: (event) => {
    event.preventDefault();

    showingQuickFind.value = true;
  },
});

if (import.meta.client) {
  const offs = [
    on(document, 'visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        saveUnsavedChanges();
      }
    }),
    on(window, 'beforeunload', () => {
      saveUnsavedChanges();
    }),
  ];

  onBeforeUnmount(() => saveUnsavedChanges());
  onScopeDispose(() => invokeArrayFns(offs));
}
</script>

<template>
  <div class="note-editor__wrapper">
    <EditorContent class="note-editor" :editor />

    <Component
      :is="isSmallScreen ? LazyFixedBox : LazyBubbleBox"
      v-if="editor"
      :editor
    >
      <WorkspaceNoteFormatter :editor />
    </Component>

    <Teleport to="#teleports">
      <WithModalTransition>
        <LazyWorkspaceNoteQuickFind
          v-if="editor && showingQuickFind"
          :editor
          @close="showingQuickFind = false"
        />
      </WithModalTransition>
    </Teleport>
  </div>
</template>
