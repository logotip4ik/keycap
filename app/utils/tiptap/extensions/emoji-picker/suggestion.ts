import type { Emoji } from '@emoji-mart/data';
import type { Editor } from '@tiptap/core';
import type { SuggestionOptions } from '@tiptap/suggestion';

import { PluginKey } from '@tiptap/pm/state';
import { exitSuggestion, Suggestion } from '@tiptap/suggestion';
import { VueRenderer } from '@tiptap/vue-3';

import { withCachedComponent } from '../helpers';

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
    render: createSuggestionRenderer(),
  });
}

const withEmojiComp = withCachedComponent(() => import('./EmojiPicker.vue'));

function createSuggestionRenderer(): SuggestionOptions['render'] {
  return () => {
    let renderer: VueRenderer | undefined;
    // this fixes such use case:
    // 1. user focues item inside emoji picker
    // 2. user presses Esc -> this closes emoji picker and focuses the editor, but this triggers
    //    suggestion to render the picker once again
    let shouldHide = false;

    return {
      onStart(props) {
        // this is needed because with `defineAsyncComponent` and `VueRenderer` we can't get exposed
        // values, so we use custom function to load "sync" component and use it instead
        withEmojiComp((component) => {
          renderer = new VueRenderer(component, {
            props: {
              shouldBeVisible: shouldHide ? false : props.editor.isFocused,
              items: props.items,
              editor: props.editor,
              onSelect: props.command,
              getBoundingClientRect: props.clientRect,
              onClose: () => {
                exitSuggestion(props.editor.view, EmojiPickerSuggestionPluginKey);
                shouldHide = true;
              },
            },
            editor: props.editor,
          });
        });
      },

      onUpdate(props) {
        shouldHide = false;

        return renderer?.updateProps({
          shouldBeVisible: props.editor.isFocused,
          items: props.items,
          editor: props.editor,
          onSelect: props.command,
          getBoundingClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        return renderer?.ref.handleKeypress(props.event);
      },

      onExit() {
        renderer?.destroy();
        renderer = undefined;
      },
    };
  };
}
