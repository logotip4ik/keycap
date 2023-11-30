import { Editor, type EditorOptions } from '@tiptap/vue-3';

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

const editor = shallowRef<Editor | undefined>();

function initTiptap() {
  if (import.meta.server || editor.value)
    return;

  const isSmallScreen = getIsSmallScreen();

  editor.value = new Editor({
    autofocus: !isSmallScreen && 'start', // disable auto focus on small screens
    editable: true,
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
          editor.isEmpty ? ' # Start with heading...' : 'Write something...',
      }),
    ],
  });
}

export function useTiptap() {
  if (!editor.value)
    initTiptap();

  return { editor, setContent, setOptions, onUpdate };
}

function withEditor(cb: (editor: Editor) => any) {
  if (editor.value)
    return cb(editor.value);

  const stop = watch(editor, (editor) => {
    if (editor) {
      stop();
      cb(editor);
    }
  });
}

function setOptions(options: Partial<EditorOptions>) {
  withEditor(
    (editor) => editor.setOptions(options),
  );
}

function setContent(content: string) {
  withEditor(
    (editor) => editor.commands.setContent(content),
  );
}

function onUpdate(cb: (editor: Editor) => any) {
  let updater: (() => any) | undefined;

  withEditor((editor) => {
    updater = () => cb(editor);

    editor.on('update', updater);
  });

  onScopeDispose(() => {
    editor.value?.off('update', updater);
  });
}
