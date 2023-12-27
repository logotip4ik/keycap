import { Editor } from '@tiptap/vue-3';

import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Code from '@tiptap/extension-code';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import BubbleMenuPlugin from '@tiptap/extension-bubble-menu';
import CodeBlock from '@tiptap/extension-code-block';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';

import type { Editor as CoreEditor } from '@tiptap/core';
import type { Transaction } from '@tiptap/pm/state';

const editor = shallowRef<Editor | undefined>();
const isTyping = ref(false);

const debouncedClearTyping = debounce(() => {
  isTyping.value = false;
}, 500);

function initTiptap() {
  if (import.meta.server || editor.value)
    return;

  const isSmallScreen = getIsSmallScreen();

  editor.value = new Editor({
    autofocus: !isSmallScreen && 'start', // disable auto focus on small screens
    editable: true,
    editorProps: {
      handleKeyDown() {
        isTyping.value = !!debouncedClearTyping();
      },
    },
    extensions: [
      Document,
      Text,
      Paragraph,
      Blockquote,
      BulletList,
      HardBreak,
      Heading.configure({ levels: [1, 2, 3] }),
      ListItem,
      OrderedList,
      Bold,
      Italic,
      Strike,
      History,
      Link,
      TaskList,
      TaskItem,
      BubbleMenuPlugin,
      Code.configure({
        HTMLAttributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'none',
          spellcheck: 'false',
        },
      }),
      // TODO: https://tiptap.dev/api/nodes/code-block-lowlight
      CodeBlock.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            autocomplete: { default: 'off' },
            autocorrect: { default: 'off' },
            autocapitalize: { default: 'none' },
            spellcheck: { default: 'false' },
          };
        },
      }),
      Placeholder.configure({
        placeholder: ({ editor }) =>
          editor.isEmpty ? '# Start with heading...' : 'Write something...',
      }),
    ],
  });
}

export function useTiptap() {
  if (!editor.value)
    initTiptap();

  return { editor, isTyping, onUpdate, withEditor };
}

function withEditor(cb: (editor: Editor) => void) {
  if (editor.value)
    return cb(editor.value);

  const stop = watch(editor, (editor) => {
    if (editor) {
      stop();
      cb(editor);
    }
  });
}

function onUpdate(cb: (e: { editor: CoreEditor, transaction: Transaction }) => void) {
  withEditor((editor) => editor.on('update', cb));

  onScopeDispose(() => editor.value?.off('update', cb));
}
