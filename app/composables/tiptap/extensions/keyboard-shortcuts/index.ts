import { Extension, findChildrenInRange } from '@tiptap/core';
import TaskItem from '@tiptap/extension-task-item';

const KEYWORD_RE = /\S+$/;

export const KeyboardShortcuts = new Extension({
  addKeyboardShortcuts() {
    const { isMac } = useDevice();

    let prevItemPosWhichReachedEnd: number | undefined;

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

      // In mobile firefox `Process` is called when user removes text in task item. But because task
      // item itself doesn't handle that, user can't delete task item (he remains stuck in this
      // situation). To prevent that, we add `Process` handler our self's.
      'Process': ({ editor }) => {
        // need to be wrapped in requestAnimationFrame to get "current" editor state, not previous
        // (before keypress handling)
        requestAnimationFrame(() => {
          const { selection, doc } = editor.state;

          const child = findChildrenInRange(doc, selection, (node) => {
            return node.type.name === TaskItem.name;
          })[0];

          if (child) {
            const { node, pos } = child;

            if (node.textContent === '') {
              if (prevItemPosWhichReachedEnd && prevItemPosWhichReachedEnd === pos) {
                prevItemPosWhichReachedEnd = undefined;

                editor.commands.joinUp();
              }
              else {
                prevItemPosWhichReachedEnd = pos;
              }
            }
          }
          else {
            prevItemPosWhichReachedEnd = undefined;
          }
        });

        return true;
      },
    };
  },

});
