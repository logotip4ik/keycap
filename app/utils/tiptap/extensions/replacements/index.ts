import { Extension } from '@tiptap/core';
import { createReplacementsSuggestionPlugin } from './suggestion';

export const Replacements = Extension.create({
  name: 'Replacements',

  addProseMirrorPlugins() {
    return [
      createReplacementsSuggestionPlugin({ editor: this.editor }),
    ];
  },
});
