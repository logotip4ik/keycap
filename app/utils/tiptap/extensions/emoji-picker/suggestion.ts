import type { Emoji } from '@emoji-mart/data';
import type { Editor } from '@tiptap/core';

import { PluginKey } from '@tiptap/pm/state';
import { Suggestion } from '@tiptap/suggestion';

import { createSuggestionRenderer } from '../helpers';

const EmojiPickerSuggestionPluginKey = new PluginKey('emoji-picker-suggestion');

export function createEmojiPickerSuggestionPlugin({ editor }: { editor: Editor }) {
  const fuzzyWorker = getFuzzyWorker();

  return Suggestion({
    editor,
    pluginKey: EmojiPickerSuggestionPluginKey,
    char: ':',
    async items({ query }): Promise<Array<Emoji>> {
      if (import.meta.server || query.length === 0) {
        return [];
      };

      return await fuzzyWorker.value?.searchForEmoji(query) || [];
    },
    command: ({ editor, range, props: emoji }) => {
      const skin = (emoji as Emoji).skins.find((skin) => skin.native !== undefined);

      if (skin) {
        editor.commands.insertContentAt(range, skin.native);
      };
    },
    render: createSuggestionRenderer({
      pluginKey: EmojiPickerSuggestionPluginKey,
      compLoader: () => import('./EmojiPicker.vue'),
    }),
  });
}
