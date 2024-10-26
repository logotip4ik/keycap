import type { Transaction } from '@tiptap/pm/state';

import type { ShallowRef } from 'vue';

import { Editor } from '@tiptap/core';
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

import proxy from 'unenv/runtime/mock/proxy';
import { BubbleMenu } from './extensions/bubble-menu';
import { EmojiPicker } from './extensions/emoji-picker';
import { Link } from './extensions/link';

const currentTiptap: ShallowRef<Editor | undefined> = import.meta.server ? proxy : shallowRef<Editor>();
const isTyping = /* #__PURE__ */ ref(false); // this will be removed in server bundle

const debouncedClearTyping = debounce(() => isTyping.value = false, 500);

function initTiptap() {
  if (import.meta.server) {
    return;
  }

  return new Editor({
    autofocus: false,
    editable: true,
    editorProps: {
      attributes: {
        spellcheck: getSetting(settings.spellcheck).value === 'yes' ? 'true' : 'false',
      },
      handleKeyDown() {
        isTyping.value = !!debouncedClearTyping();
      },
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

export function useTiptap() {
  const editor = initTiptap()!;

  currentTiptap.value = editor;

  const offs: Array<() => void> = [
    () => currentTiptap.value = undefined,
  ];

  onScopeDispose(() => {
    invokeArrayFns(offs);
    offs.length = 0;
    editor.destroy();
  });

  return {
    editor,
    isTyping,
    onUpdate: (cb: (e: { editor: Editor, transaction: Transaction }) => void) => {
      editor.on('update', cb);

      offs.push(() => editor.off('update', cb));
    },
  };
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
