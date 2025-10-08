import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import type { PluginView } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { getChangedRanges } from '@tiptap/core';

import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Transform } from '@tiptap/pm/transform';

export interface AutoFloatTaskPluginOptions {
  enabled: boolean
  editor: Editor
}

export const AutoFloatTaskPluginKey = new PluginKey('autoFloatTask');

class TransitionView implements PluginView {
  animations: Array<Animation> = [];

  update(view: EditorView) {
    const state = AutoFloatTaskPluginKey.getState(view.state) as State | undefined;

    if (!state || !state.movedTasks) {
      return;
    }

    for (const moved of state.movedTasks) {
      const newNode = view.nodeDOM(moved.pos);
      if (!(newNode instanceof HTMLElement)) {
        continue;
      }

      const newPos = newNode.getBoundingClientRect();
      const dx = moved.oldPos.left - newPos.left;
      const dy = moved.oldPos.top - newPos.top;

      if (dx || dy) {
        stopAnimations(newNode);

        const animation = newNode.animate([
          { transform: `translate(${dx}px,${dy}px)` },
          { transform: `rotate(0)` },
        ], { duration: 400, easing: EASINGS.EXPO });

        this.animations.push(animation);

        const offs = [
          on(animation, 'finish', () => {
            remove(this.animations, animation);
            invokeArrayFns(offs);
          }, { once: true }),
          on(animation, 'cancel', () => {
            remove(this.animations, animation);
            invokeArrayFns(offs);
          }, { once: true }),
          on(animation, 'remove', () => {
            remove(this.animations, animation);
            invokeArrayFns(offs);
          }, { once: true }),
        ];
      }
    }
  }

  destroy() {
    for (const animation of this.animations) {
      animation.cancel();
    }
    this.animations.length = 0;
  }
}

interface MovedTask {
  pos: number
  oldPos: DOMRect
}

interface State {
  movedTasks?: Array<MovedTask>
}

const OriginalHistoryPluginKey = 'history$';
export function AutoFloatTaskPlugin(options: AutoFloatTaskPluginOptions) {
  return new Plugin({
    key: AutoFloatTaskPluginKey,

    state: {
      init(): State {
        return {};
      },
      apply(tr) {
        return tr.getMeta(AutoFloatTaskPluginKey);
      },
    },

    view() {
      return new TransitionView();
    },

    appendTransaction(transactions, oldState, newState) {
      if (!options.enabled) {
        return;
      }

      const docChanges = transactions.some((transaction) => transaction.docChanged) && !oldState.doc.eq(newState.doc);
      const historyChanges = transactions.some((tr) => !!tr.getMeta(OriginalHistoryPluginKey));

      if (!docChanges || historyChanges) {
        return;
      }

      const transform = new Transform(oldState.doc);
      for (const tr of transactions) {
        for (const step of tr.steps) {
          transform.step(step);
        }
      }

      const changes = getChangedRanges(transform);

      if (changes.length > 3) {
        return;
      }

      interface ChangedTask {
        checked: boolean
        pos: number
        node: Node
        list: { node: Node, pos: number }
        oldNode: Node
      }
      let changedTask: ChangedTask | undefined;

      for (const { newRange } of changes) {
        newState.doc.nodesBetween(newRange.from, newRange.to, (node, pos) => {
          const isTaskItem = node.type.name === TaskItem.name;
          if (
            changedTask
            || !isTaskItem
            || oldState.doc.nodeSize < pos
          ) {
            return changedTask ? false : !isTaskItem;
          }

          if (newState.doc.nodeAt(pos)?.textContent === '') {
            return false;
          }

          const oldNode = oldState.doc.nodeAt(pos);
          if (
            oldNode?.type.name !== TaskItem.name
            || node.attrs.checked === oldNode.attrs.checked
          ) {
            return;
          }

          const resolvedPos = newState.doc.resolve(pos);
          const parentList = resolvedPos.parent;
          if (parentList.type.name !== TaskList.name) {
            return;
          }

          changedTask = {
            checked: node.attrs.checked,
            pos,
            node,
            oldNode,
            list: {
              node: parentList,
              pos: resolvedPos.before(resolvedPos.depth),
            },
          };

          return false;
        });

        if (changedTask) {
          break;
        }
      }

      if (!changedTask || changedTask.list.node.childCount === 1) {
        return;
      }

      const movedTasks: Array<MovedTask> = [];

      const insertPos = changedTask.checked
        ? changedTask.list.pos + changedTask.list.node.nodeSize - 1 - changedTask.node.nodeSize
        : changedTask.list.pos + 1;

      const from = changedTask.checked
        ? changedTask.pos
        : changedTask.list.pos;
      const to = changedTask.checked
        ? changedTask.list.pos + changedTask.list.node.nodeSize
        : changedTask.pos + changedTask.node.nodeSize;

      newState.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name !== TaskItem.name) {
          return;
        }

        const domNode = options.editor.view.nodeDOM(pos);
        if (!(domNode instanceof HTMLElement) || !changedTask) {
          return;
        }

        let newPos = pos;
        if (changedTask.node === node) {
          newPos = insertPos;
        }
        else {
          newPos = changedTask.checked
            ? pos - changedTask.node.nodeSize
            : pos + changedTask.node.nodeSize;
        }

        movedTasks.push({
          oldPos: domNode.getBoundingClientRect(),
          pos: newPos,
        });
      });

      const tr = newState.tr;

      tr.setMeta(AutoFloatTaskPluginKey, {
        movedTasks,
      } satisfies State);

      tr.delete(changedTask.pos, changedTask.pos + changedTask.node.nodeSize);

      tr.insert(
        insertPos,
        changedTask.node,
      );

      return tr;
    },
  });
}
