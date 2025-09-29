import type { Editor, EditorEvents } from '@tiptap/vue-3';
import type { ShallowRef } from 'vue';

import proxy from 'unenv/runtime/mock/proxy';

import { AutoFloatTaskPlugin, AutoFloatTaskPluginKey, initTiptap } from '~/utils/tiptap';

const currentTiptap: ShallowRef<Editor | undefined> = import.meta.server ? proxy : shallowRef<Editor>();

export function useTiptap(opts: {
  content: MaybeRefOrGetter<string>
  spellcheck: MaybeRefOrGetter<SettingsDefinitions[Settings['spellcheck']]['value']>
  editable: MaybeRefOrGetter<boolean>
  autoFloatTask: MaybeRefOrGetter<SettingsDefinitions[Settings['autoFloatTask']]['value']>
  onUpdate: (props: EditorEvents['update']) => void
}) {
  const isTyping = ref(false);
  const debouncedClearTyping = debounce(() => isTyping.value = false, 500);

  const editor = initTiptap({
    content: toValue(opts.content),
    spellcheck: toValue(opts.spellcheck),
    editable: toValue(opts.editable),
    onUpdate: opts.onUpdate,
    onKeyDown: () => {
      isTyping.value = !!debouncedClearTyping();
    },
  })!;

  watch(() => toValue(opts.content), (content) => {
    if (isTyping.value) {
      return;
    }

    const editorContent = editor.getHTML();

    if (editorContent !== content) {
      editor.commands.setContent(content || '', { emitUpdate: false });
    }
  });

  watch(() => toValue(opts.editable), (editable) => {
    editor.setOptions({ editable });
  });

  watch(() => toValue(opts.spellcheck), (spellcheck) => {
    editor.setOptions({
      editorProps: {
        attributes: {
          ...editor.options.editorProps.attributes,
          spellcheck: spellcheck === 'yes' ? 'true' : 'false',
        },
      },
    });
  });

  watch(() => toValue(opts.autoFloatTask), (autoFloatTask) => {
    editor.unregisterPlugin(AutoFloatTaskPluginKey);
    editor.registerPlugin(AutoFloatTaskPlugin({
      enabled: autoFloatTask === 'yes',
      editor,
    }));
  }, { immediate: true });

  currentTiptap.value = editor;

  onScopeDispose(() => {
    currentTiptap.value = undefined;

    // @see https://github.com/ueberdosis/tiptap/pull/5772/files#diff-c79287bdd112b4264f53e38c24a0de06a0a7cf50db8134c29087ef8c44d94124
    // it really feels smoother
    // Cloning root node (and its children) to avoid content being lost by destroy
    const nodes = editor.view.dom;
    const newEl = nodes?.cloneNode(true) as HTMLElement;

    nodes?.parentNode?.replaceChild(newEl, nodes);

    // If user navigates right after keypress, `isTyping` could be true on next
    // render of NoteEditor component, and so content watcher will not update
    // editor's content. This prevents such case by explicitly setting `isTyping`
    // to false after unmounting
    isTyping.value = false;

    editor.destroy();
  });

  return { editor };
}

export function withTiptapEditor(cb: (editor: Editor) => void) {
  const tiptap = currentTiptap.value;
  if (tiptap) {
    return cb(tiptap);
  }

  const stop = watch(currentTiptap, (editor) => {
    if (editor) {
      stop();
      cb(editor);
    }
  });
}
