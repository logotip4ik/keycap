import type { Editor } from '@tiptap/core';

import { LazyIconBaselineCode, LazyIconBaselineFormatBold, LazyIconBaselineFormatItalic, LazyIconBaselineLink, LazyIconStrikeThrough } from '#components';

export const LinkInputPlaceholder = {
  INITIALLY_EMPTY: 'hit enter to show menu',
  MADE_EMPTY: 'hit enter to remove link',
};

export interface MarkButton {
  icon: Component
  ariaLabel: string
  shortcut: ComputedRef<string>
  isActive: (e: Editor) => boolean
  /** @description empty click handler acts as __toggling link form__ */
  onClick?: (e: Editor) => any
}

export const marks: Array<MarkButton> = [
  {
    icon: LazyIconBaselineFormatBold,
    ariaLabel: 'toggle bold',
    shortcut: computed(() => `${getModKey()}+b`),
    isActive: (editor) => editor.isActive('bold'),
    onClick: (editor) => editor!.chain().focus().toggleBold().run(),
  },

  {
    icon: LazyIconBaselineFormatItalic,
    ariaLabel: 'toggle italic',
    shortcut: computed(() => `${getModKey()}+i`,),
    isActive: (editor) => editor.isActive('italic'),
    onClick: (editor) => editor!.chain().focus().toggleItalic().run(),
  },

  {
    icon: LazyIconBaselineCode,
    shortcut: computed(() => `${getModKey()}+e`,),
    ariaLabel: 'toggle code',
    isActive: (editor) => editor.isActive('code'),
    onClick: (editor) => editor!.chain().focus().toggleCode().run(),
  },

  {
    icon: LazyIconStrikeThrough,
    shortcut: computed(() => `${getModKey()}+Shift+S`),
    ariaLabel: 'strike through',
    isActive: (editor) => editor.isActive('strike'),
    onClick: (editor) => editor!.chain().focus().toggleStrike().run(),
  },

  {
    icon: LazyIconBaselineLink,
    shortcut: computed(() => `${getModKey()}+l`),
    ariaLabel: 'toggle link',
    isActive: (editor) => editor.isActive('link'),
  },
];
