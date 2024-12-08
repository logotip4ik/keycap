import { Extension, findChildrenInRange } from '@tiptap/core';
import TaskItem from '@tiptap/extension-task-item';

export const TaskItemCleaner = new Extension({
  addKeyboardShortcuts() {
    let prevItemPosWhichReachedEnd: number | undefined;

    // In mobile firefox `Process` is called when user removes text in task item. But because task
    // item itself doesn't handle that, user can't delete task item (he remains stuck in this
    // situation). To prevent that, we add `Process` handler our self's.
    return {
      Process: ({ editor }) => {
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
