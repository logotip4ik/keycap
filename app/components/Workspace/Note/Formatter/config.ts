import type { Editor } from '@tiptap/core';
import type { ShallowReactive } from 'vue';

export const LinkInputPlaceholder = {
  INITIALLY_EMPTY: 'hit enter to show menu',
  MADE_EMPTY: 'hit enter to remove link',
};

interface MarkButton {
  icon: IconName
  ariaLabel: string
  shortcut: string
  isActive: ComputedRef<boolean>
  onClick: () => any
}

export function makeMarks(props: ShallowReactive<{ editor: Editor }>): Array<MarkButton> {
  const modKey = useModKey();

  return [
    {
      icon: 'baseline-format-bold',
      ariaLabel: 'toggle bold',
      shortcut: `${modKey}+b`,
      isActive: computed(() => props.editor.isActive('bold')),
      onClick: () => props.editor.chain().focus().toggleBold().run(),
    },

    {
      icon: 'baseline-format-italic',
      ariaLabel: 'toggle italic',
      shortcut: `${modKey}+i`,
      isActive: computed(() => props.editor.isActive('italic')),
      onClick: () => props.editor.chain().focus().toggleItalic().run(),
    },

    {
      icon: 'baseline-code',
      shortcut: `${modKey}+e`,
      ariaLabel: 'toggle code',
      isActive: computed(() => props.editor.isActive('code')),
      onClick: () => props.editor.chain().focus().toggleCode().run(),
    },

    {
      icon: 'format-strikethrough',
      shortcut: `${modKey}+Shift+S`,
      ariaLabel: 'strike through',
      isActive: computed(() => props.editor.isActive('strike')),
      onClick: () => props.editor.chain().focus().toggleStrike().run(),
    },

    {
      icon: 'format-ink-highlighter',
      shortcut: `${modKey}+Shift+H`,
      ariaLabel: 'highlight',
      isActive: computed(() => props.editor.isActive('highlight')),
      onClick: () => props.editor.chain().focus().toggleHighlight().run(),
    },
  ];
}
