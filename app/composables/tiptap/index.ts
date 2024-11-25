import type { EditorEvents } from '@tiptap/core';
import type { ShallowRef } from 'vue';

import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';

import { Editor } from '@tiptap/vue-3';

import proxy from 'unenv/runtime/mock/proxy';

import { BubbleMenu } from './extensions/bubble-menu';
import { EmojiPicker } from './extensions/emoji-picker';
import { Link } from './extensions/link';

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
      Blockquote,
      BulletList,
      HardBreak,
      Heading.configure({ levels: [1, 2, 3] }),
      ListItem,
      OrderedList,
      Bold.extend({ inclusive: false }),
      Highlight.extend({ inclusive: false }),
      Italic.extend({ inclusive: false }),
      Strike.extend({ inclusive: false }),
      Link,
      TaskList,
      TaskItem,
      BubbleMenu,
      EmojiPicker,
      Code.extend({ inclusive: false }).configure({
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
      History.configure({
        depth: 100,
      }),
      Placeholder.configure({
        placeholder: ({ editor }) =>
          editor.isEmpty ? '# Start with heading...' : 'Write something...',
      }),
    ],
  });
}

const currentTiptap: ShallowRef<Editor | undefined> = import.meta.server ? proxy : shallowRef<Editor>();

export function useTiptap(opts: {
  content: MaybeRefOrGetter<string>
  spellcheck: MaybeRefOrGetter<SettingsDefinitions[Settings['spellcheck']]['value']>
  editable: MaybeRefOrGetter<boolean>
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
      editor.commands.setContent(content || '');
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

  currentTiptap.value = editor;

  const offs: Array<() => void> = [
    () => currentTiptap.value = undefined,
  ];

  onScopeDispose(() => {
    invokeArrayFns(offs);
    offs.length = 0;

    // @see https://github.com/ueberdosis/tiptap/pull/5772/files#diff-c79287bdd112b4264f53e38c24a0de06a0a7cf50db8134c29087ef8c44d94124
    // it really feels smoother
    // Cloning root node (and its children) to avoid content being lost by destroy
    const nodes = editor.options.element;
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
