import type { Editor } from '@tiptap/core';

import type { Replacement } from './replacements';

import { PluginKey } from '@tiptap/pm/state';
import { Suggestion } from '@tiptap/suggestion';

import { createSuggestionRenderer } from '../helpers';
import { replacements } from './replacements';

const replacementsPluginKey = new PluginKey('replacements');

export function createReplacementsSuggestionPlugin({ editor }: { editor: Editor }) {
  const fuzzyWorker = getFuzzyWorker();

  return Suggestion({
    editor,
    pluginKey: replacementsPluginKey,
    char: '/',
    async items({ query }): Promise<Array<Replacement>> {
      return await fuzzyWorker.value?.searchForReplacement(query) || [];
    },
    command: ({ editor, range, props: replacement }) => {
      const editorCommand = replacements[replacement as Replacement];

      if (!editorCommand) {
        return;
      }

      if ('replacement' in editorCommand) {
        return editor.commands.insertContentAt(
          range,
          editorCommand.replacement(),
          { applyInputRules: false, applyPasteRules: false },
        );
      }

      editorCommand.action(editor, range);
    },
    render: createSuggestionRenderer({
      compLoader: () => import('./Replacements.vue'),
      pluginKey: replacementsPluginKey,
    }),
  });
}
