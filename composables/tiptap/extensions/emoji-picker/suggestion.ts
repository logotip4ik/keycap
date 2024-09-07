import { PluginKey } from '@tiptap/pm/state';
import { Suggestion } from '@tiptap/suggestion';
import { VueRenderer } from '@tiptap/vue-3';

import type { Emoji } from '@emoji-mart/data';
import type { Editor } from '@tiptap/core';
import type { SuggestionOptions } from '@tiptap/suggestion';

import EmojiPicker from './EmojiPicker.vue';

export function createEmojiPickerSuggestionPlugin({ editor }: { editor: Editor }) {
  const fuzzyWorker = useFuzzyWorker();

  return Suggestion({
    editor,
    pluginKey: new PluginKey('emoji-picker-suggestion'),
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
        editor.view.dispatch(
          editor.state.tr.replaceRangeWith(
            range.from,
            range.to,
            editor.state.schema.text(`${skin.native} `),
          ),
        );
      };
    },
    render: createSuggestionRenderer(EmojiPicker),
  });
}

function createSuggestionRenderer(component: Component): SuggestionOptions['render'] {
  return () => {
    let renderer: VueRenderer;

    return {
      onStart(props) {
        renderer = new VueRenderer(component, {
          props: {
            shouldBeVisible: true,
            items: props.items,
            onSelect: props.command,
            getBoundingClientRect: props.clientRect,
          },
          editor: props.editor,
        });
      },

      onUpdate(props) {
        return renderer.updateProps({
          shouldBeVisible: props.editor.isFocused,
          items: props.items,
          onSelect: props.command,
          getBoundingClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          renderer.updateProps({
            items: [],
            shouldBeVisible: false,
          });
          return true;
        }

        return false;
      },

      onExit() {
        renderer?.destroy();
      },
    };
  };
}
