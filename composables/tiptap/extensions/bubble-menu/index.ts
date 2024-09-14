import type { BubbleMenuPluginProps } from './plugin';

import { Extension } from '@tiptap/core';
import { BubbleMenuPlugin } from './plugin';

export type BubbleMenuOptions = Omit<BubbleMenuPluginProps, 'editor' | 'element'> & {
  element: HTMLElement | null
};

export const BubbleMenu = Extension.create<BubbleMenuOptions>({
  name: 'bubbleMenu',

  addOptions() {
    return {
      element: null,
      pluginKey: 'bubbleMenu',
    };
  },

  addProseMirrorPlugins() {
    if (!this.options.element) {
      return [];
    }

    return [
      BubbleMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
      }),
    ];
  },
});
