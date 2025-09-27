import type { EditorEvents } from '@tiptap/core';
import type { ShallowRef } from 'vue';

import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { Code } from '@tiptap/extension-code';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { Italic } from '@tiptap/extension-italic';
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { Placeholder, UndoRedo } from '@tiptap/extensions';

import { Editor } from '@tiptap/vue-3';

import proxy from 'unenv/runtime/mock/proxy';

import { AutoFloatTaskPlugin, AutoFloatTaskPluginKey } from './extensions/auto-float-task-item';
import { BubbleMenu } from './extensions/bubble-menu';
import { EmojiPicker } from './extensions/emoji-picker';
import { Find } from './extensions/find';
import { KeyboardShortcuts } from './extensions/keyboard-shortcuts';
import { Link } from './extensions/link';

export { FindPluginKey } from './extensions/find';

function initTiptap(opts: {
  content: string
  editable: boolean
  spellcheck: SettingsDefinitions[Settings['spellcheck']]['value']
  onKeyDown: () => void
  onUpdate: (props: EditorEvents['update']) => void
}) {
  if (import.meta.server) {
    return;
  }

  return new Editor({
    injectCSS: false,
    autofocus: false,
    editable: opts.editable,
    content: opts.content,
    onUpdate: opts.onUpdate,
    editorProps: {
      attributes: {
        'aria-label': 'Rich text editor',
        'spellcheck': opts.spellcheck === 'yes' ? 'true' : 'false',
      },
      handleKeyDown: opts.onKeyDown,
    },
    extensions: [
      Document,
      Paragraph,
      Text,
      Blockquote.extend({
        addKeyboardShortcuts() {
          return {
            'Mod-Shift-6': () => this.editor.commands.toggleBlockquote(),
          };
        },
      }),
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem,
      HardBreak,
      Heading.configure({ levels: [1, 2, 3] }),
      Bold.extend({ inclusive: true, exitable: true, keepOnSplit: false }),
      Italic.extend({ inclusive: true, exitable: true, keepOnSplit: false }),
      Strike.extend({ inclusive: true, exitable: true, keepOnSplit: false }),
      Highlight.extend({ inclusive: true, exitable: true, keepOnSplit: false }),
      Link,
      BubbleMenu,
      EmojiPicker,
      Code.extend({
        inclusive: true,
        exitable: true,
        keepOnSplit: false,
        code: true,
      }).configure({
        HTMLAttributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'none',
          spellcheck: 'false',
        },
      }),
      // TODO: https://tiptap.dev/api/nodes/code-block-lowlight
      CodeBlock.configure({
        HTMLAttributes: {
          autocomplete: { default: 'off' },
          autocorrect: { default: 'off' },
          autocapitalize: { default: 'none' },
          spellcheck: { default: 'false' },
        },
      }),
      UndoRedo.configure({ newGroupDelay: 300, depth: 400 }),
      Placeholder.configure({
        placeholder: ({ editor }) =>
          editor.isEmpty ? '# Start with heading...' : 'Write something...',
      }),
      Find,
      KeyboardShortcuts,
    ],
  });
}

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
