import type { Editor } from '@tiptap/core';

import { LazyIconBaselineCode, LazyIconBaselineFormatBold, LazyIconBaselineFormatItalic, LazyIconBaselineLink, LazyIconStrikeThrough } from '#components';

export const LinkInputPlaceholder = {
  INITIALLY_EMPTY: 'hit enter to show menu',
  MADE_EMPTY: 'hit enter to remove link',
};

export interface MarkButton {
  icon: Component
  ariaLabel: string
  shortcut: string
  isActive: (e: Editor) => boolean
  /** @description empty click handler acts as __toggling link form__ */
  onClick?: (e: Editor) => any
}

export const marks: Array<MarkButton> = [
  {
    icon: LazyIconBaselineFormatBold,
    ariaLabel: 'toggle bold',
    shortcut: 'Ctrl+b',
    isActive: (editor) => editor.isActive('bold'),
    onClick: (editor) => editor!.chain().focus().toggleBold().run(),
  },

  {
    icon: LazyIconBaselineFormatItalic,
    ariaLabel: 'toggle italic',
    shortcut: 'Ctrl+i',
    isActive: (editor) => editor.isActive('italic'),
    onClick: (editor) => editor!.chain().focus().toggleItalic().run(),
  },

  {
    icon: LazyIconBaselineCode,
    shortcut: 'Ctrl+e',
    ariaLabel: 'toggle code',
    isActive: (editor) => editor.isActive('code'),
    onClick: (editor) => editor!.chain().focus().toggleCode().run(),
  },

  {
    icon: LazyIconStrikeThrough,
    shortcut: 'Ctrl+Shift+S',
    ariaLabel: 'strike through',
    isActive: (editor) => editor.isActive('strike'),
    onClick: (editor) => editor!.chain().focus().toggleStrike().run(),
  },

  {
    icon: LazyIconBaselineLink,
    shortcut: 'Ctrl+l',
    ariaLabel: 'toggle link',
    isActive: (editor) => editor.isActive('link'),
  },
];
