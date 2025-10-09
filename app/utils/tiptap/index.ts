import type { EditorEvents } from '@tiptap/core';

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

import { BubbleMenu } from './extensions/bubble-menu';
import { EmojiPicker } from './extensions/emoji-picker';
import { Find } from './extensions/find';
import { KeyboardShortcuts } from './extensions/keyboard-shortcuts';
import { createLink } from './extensions/link';
import { Replacements } from './extensions/replacements';

export { AutoFloatTaskPlugin, AutoFloatTaskPluginKey } from './extensions/auto-float-task-item';
export { FindPluginKey } from './extensions/find';

export function initTiptap(opts: {
  username: string | undefined
  content: string
  editable: boolean
  spellcheck?: SettingsDefinitions[Settings['spellcheck']]['value']
  class: string
  onUpdate: (props: EditorEvents['update']) => void
  onKeyDown?: () => void
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
        'class': opts.class,
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
      createLink({ username: opts.username }),
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
        placeholder: ({ editor }) => {
          if (!editor.isFocused) {
            return 'Press [ i ] to focus';
          }

          return editor.isEmpty ? '# Start with heading...' : 'Continue writing...';
        },
      }),
      Find,
      KeyboardShortcuts,
      Replacements,
    ],
  });
}
