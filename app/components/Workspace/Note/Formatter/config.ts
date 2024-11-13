import type { Editor } from '@tiptap/core';

import {
  LazyIconBaselineCode,
  LazyIconBaselineFormatBold,
  LazyIconBaselineFormatItalic,
  LazyIconHighlighter,
  LazyIconStrikeThrough,
} from '#components';

export const LinkInputPlaceholder = {
  INITIALLY_EMPTY: 'hit enter to show menu',
  MADE_EMPTY: 'hit enter to remove link',
};

interface MarkButton {
  icon: Component
  ariaLabel: string
  shortcut: string
  isActive: (e: Editor) => boolean
  onClick: (e: Editor) => any
}

export function makeMarks(): Array<MarkButton> {
  const modKey = useModKey();

  return [
    {
      icon: LazyIconBaselineFormatBold,
      ariaLabel: 'toggle bold',
      shortcut: `${modKey}+b`,
      isActive: (editor) => editor.isActive('bold'),
      onClick: (editor) => editor.chain().focus().toggleBold().run(),
    },

    {
      icon: LazyIconBaselineFormatItalic,
      ariaLabel: 'toggle italic',
      shortcut: `${modKey}+i`,
      isActive: (editor) => editor.isActive('italic'),
      onClick: (editor) => editor.chain().focus().toggleItalic().run(),
    },

    {
      icon: LazyIconBaselineCode,
      shortcut: `${modKey}+e`,
      ariaLabel: 'toggle code',
      isActive: (editor) => editor.isActive('code'),
      onClick: (editor) => editor.chain().focus().toggleCode().run(),
    },

    {
      icon: LazyIconStrikeThrough,
      shortcut: `${modKey}+Shift+S`,
      ariaLabel: 'strike through',
      isActive: (editor) => editor.isActive('strike'),
      onClick: (editor) => editor.chain().focus().toggleStrike().run(),
    },

    {
      icon: LazyIconHighlighter,
      shortcut: `${modKey}+Shift+H`,
      ariaLabel: 'highlight',
      isActive: (editor) => editor.isActive('highlight'),
      onClick: (editor) => editor.chain().focus().toggleHighlight().run(),
    },
  ];
}
