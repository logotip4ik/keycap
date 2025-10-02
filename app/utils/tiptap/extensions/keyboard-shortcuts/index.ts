import type { Editor } from '@tiptap/core';

import { Extension } from '@tiptap/core';

const KEYWORD_RE = /\S+$/;

function wrapSelectionIn(startChar: string, endChar: string = startChar) {
  return ({ editor }: { editor: Editor }) => {
    const { selection } = editor.state;

    if (selection.empty || !selection.visible) {
      return false;
    }

    return editor
      .chain()
      .insertContentAt(selection.from, startChar)
      .insertContentAt(selection.to + 1, endChar)
      .setTextSelection({ from: selection.from + 1, to: selection.to + 1 })
      .run();
  };
}

export const KeyboardShortcuts = Extension.create({
  name: 'KeyboardShortcuts',

  addKeyboardShortcuts() {
    const { isMac } = useDevice();

    return {
      // TODO: this will probably break windows
      'Control-w': ({ editor }) => {
        if (!isMac.value) {
          return false;
        }

        const { view: { state } } = editor;

        const currentPosition = state.selection.$from;
        const currentNode = currentPosition.node();
        let textToDeleteFrom = currentNode.textContent.substring(0, currentPosition.parentOffset);

        if (!textToDeleteFrom) {
          return false;
        }

        let numberOfSpaces = 0;
        if (textToDeleteFrom.at(-1) === ' ') {
          const initialLength = textToDeleteFrom.length;
          for (let i = 0; i < initialLength; i++) {
            numberOfSpaces++;
            textToDeleteFrom = textToDeleteFrom.substring(0, textToDeleteFrom.length - 1);

            if (textToDeleteFrom.at(-1) !== ' ') {
              break;
            }
          }
        }

        const numberOfChars = KEYWORD_RE.exec(textToDeleteFrom)?.[0].length || 0;
        if (!numberOfChars && !numberOfSpaces) {
          return false;
        }

        return editor
          .chain()
          .focus()
          .setTextSelection({
            from: currentPosition.pos - numberOfChars - numberOfSpaces,
            to: currentPosition.pos,
          })
          .deleteSelection()
          .run();
      },
      '~': wrapSelectionIn('~'),
      '\'': wrapSelectionIn('\''),
      '"': wrapSelectionIn('"'),
      '`': wrapSelectionIn('`'),
      '*': wrapSelectionIn('*'),
      '_': wrapSelectionIn('_'),
      '{': wrapSelectionIn('{', '}'),
      '(': wrapSelectionIn('(', ')'),
      '[': wrapSelectionIn('[', ']'),
    };
  },
});
