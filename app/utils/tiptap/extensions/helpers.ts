import type { PluginKey } from '@tiptap/pm/state';
import type { SuggestionOptions } from '@tiptap/suggestion';
import type { Component } from 'vue';

import { exitSuggestion } from '@tiptap/suggestion';
import { VueRenderer } from '@tiptap/vue-3';

export function withCachedComponent<T>(loader: () => Promise<{ default: T }>) {
  let cache: T | Promise<T> | undefined;

  return (cb: (comp: T) => void) => {
    if (cache instanceof Promise) {
      cache.then(cb);
      return;
    }
    else if (!cache) {
      cache = loader().then((mod) => {
        cb(mod.default);
        cache = mod.default;
        return mod.default;
      });
      return;
    }

    cb(cache);
  };
}

export function createSuggestionRenderer<T extends Component>({
  compLoader,
  pluginKey,
}: {
  compLoader: () => Promise<{ default: T }>
  pluginKey: PluginKey
}): SuggestionOptions['render'] {
  const withComponent = withCachedComponent(compLoader);

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
        withComponent((component) => {
          renderer = new VueRenderer(component, {
            props: {
              shouldBeVisible: shouldHide ? false : props.editor.isFocused,
              items: props.items,
              editor: props.editor,
              onSelect: props.command,
              getBoundingClientRect: props.clientRect,
              onClose: () => {
                exitSuggestion(props.editor.view, pluginKey);
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
