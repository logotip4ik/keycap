import { VueRenderer } from '@tiptap/vue-3';
import { PluginKey } from '@tiptap/pm/state';
import { flip, offset, shift } from '@floating-ui/core';
import { computePosition } from '@floating-ui/dom';

import type { SuggestionOptions } from '@tiptap/suggestion';
import type { Emoji, EmojiMartData } from '@emoji-mart/data';
import type { ComputePositionConfig } from '@floating-ui/dom';

import EmojiPicker from './EmojiPicker.vue';

let emojis: Array<Emoji>;

export const EmojiPickerSuggestionPlugin: Partial<SuggestionOptions> = {
  pluginKey: new PluginKey('emoji-picker-suggestion'),
  char: ':',
  async items({ query }): Promise<Array<Emoji>> {
    if (import.meta.server || query.length === 0) {
      return [];
    };

    const lowerCaseQuery = query.toLowerCase();

    if (!emojis) {
      emojis = Object.values(
        (await import('@emoji-mart/data').then((m) => m.default as EmojiMartData)).emojis,
      );
    }

    const suggestedEmojis: Array<Emoji> = emojis
      // TODO: use keywords and fuzzy worker to find correct emoji
      .filter(({ id }) => id.toLowerCase().startsWith(lowerCaseQuery));

    return [...suggestedEmojis];
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
};

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
            shouldBeVisible: false,
            items: [],
            onSelect: () => {},
          });
          return true;
        }

        return renderer?.ref?.onKeyDown?.(props.event);
      },

      onExit() {
        renderer?.destroy();
      },
    };
  };
}
