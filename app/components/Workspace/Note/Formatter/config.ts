import type { Editor } from '@tiptap/core';

import type { ShallowReactive } from 'vue';
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
  isActive: ComputedRef<boolean>
  onClick: () => any
}

export function makeMarks(props: ShallowReactive<{ editor: Editor }>): Array<MarkButton> {
  const modKey = useModKey();

  return [
    {
      icon: LazyIconBaselineFormatBold,
      ariaLabel: 'toggle bold',
      shortcut: `${modKey}+b`,
      isActive: computed(() => props.editor.isActive('bold')),
      onClick: () => props.editor.chain().focus().toggleBold().run(),
    },

    {
      icon: LazyIconBaselineFormatItalic,
      ariaLabel: 'toggle italic',
      shortcut: `${modKey}+i`,
      isActive: computed(() => props.editor.isActive('italic')),
      onClick: () => props.editor.chain().focus().toggleItalic().run(),
    },

    {
      icon: LazyIconBaselineCode,
      shortcut: `${modKey}+e`,
      ariaLabel: 'toggle code',
      isActive: computed(() => props.editor.isActive('code')),
      onClick: () => props.editor.chain().focus().toggleCode().run(),
    },

    {
      icon: LazyIconStrikeThrough,
      shortcut: `${modKey}+Shift+S`,
      ariaLabel: 'strike through',
      isActive: computed(() => props.editor.isActive('strike')),
      onClick: () => props.editor.chain().focus().toggleStrike().run(),
    },

    {
      icon: LazyIconHighlighter,
      shortcut: `${modKey}+Shift+H`,
      ariaLabel: 'highlight',
      isActive: computed(() => props.editor.isActive('highlight')),
      onClick: () => props.editor.chain().focus().toggleHighlight().run(),
    },
  ];
}
