import { Mark } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import { EmojiPickerSuggestionPlugin } from './suggestion';

export const EmojiPickerKey = new PluginKey('emoji-picker');

export const EmojiPicker = Mark.create({
  name: 'emoji-picker',

  addOptions() {
    return {};
  },

  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...EmojiPickerSuggestionPlugin,
      }),
    ];
  },
});
