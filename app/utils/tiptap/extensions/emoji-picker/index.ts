import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { createEmojiPickerSuggestionPlugin } from './suggestion';

export const EmojiPickerKey = new PluginKey('emoji-picker');

export const EmojiPicker = Extension.create({
  name: 'emoji-picker',

  addProseMirrorPlugins() {
    return [
      createEmojiPickerSuggestionPlugin({
        editor: this.editor,
      }),
    ];
  },
});
