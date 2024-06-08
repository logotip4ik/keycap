import { Mark } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import { EmojiPickerSuggestionPlugin } from './suggestion';

export const EmojiPickerKey = new PluginKey('emoji-picker');

/**
 * This extension allows you to insert mentions into the editor.
 * @see https://www.tiptap.dev/api/extensions/mention
 */
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
