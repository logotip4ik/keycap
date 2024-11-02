import { Mark } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { createEmojiPickerSuggestionPlugin } from './suggestion';

export const EmojiPickerKey = new PluginKey('emoji-picker');

export const EmojiPicker = Mark.create({
  name: 'emoji-picker',

  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,

  addProseMirrorPlugins() {
    return [
      createEmojiPickerSuggestionPlugin({
        editor: this.editor,
      }),
    ];
  },
});
