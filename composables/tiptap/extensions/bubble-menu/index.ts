import { Extension } from '@tiptap/core';

import { BubbleMenuPlugin } from './plugin';
import type { BubbleMenuPluginProps } from './plugin';

export type BubbleMenuOptions = Omit<BubbleMenuPluginProps, 'editor' | 'element'> & {
  element: HTMLElement | null
};

export const BubbleMenu = Extension.create<BubbleMenuOptions>({
  name: 'bubbleMenu',

  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: 'bubbleMenu',
      updateDelay: undefined,
      shouldShow: null,
    };
  },

  addProseMirrorPlugins() {
    if (!this.options.element)
      return [];

    return [
      BubbleMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        updateDelay: this.options.updateDelay,
        shouldShow: this.options.shouldShow,
      }),
    ];
  },
});
