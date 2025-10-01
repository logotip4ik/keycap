import { Extension } from '@tiptap/core';
import { createReplacementsSuggestionPlugin } from './suggestion';

export const ReplacementsExtension = Extension.create({
  name: 'ReplacementsExtension',

  addProseMirrorPlugins() {
    return [
      createReplacementsSuggestionPlugin({ editor: this.editor }),
    ];
  },
});
