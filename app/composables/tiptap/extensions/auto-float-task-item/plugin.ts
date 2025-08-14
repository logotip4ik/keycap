import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import type { PluginView } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ReplaceAroundStep } from '@tiptap/pm/transform';

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
        ], { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });

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
      if (oldState.doc === newState.doc || !options.enabled || transactions.length !== 1) {
        return;
      }

      const [transaction] = transactions;
      if (!transaction.docChanged || transaction.getMeta(OriginalHistoryPluginKey)) {
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

      for (const step of transaction.steps) {
        if (step instanceof ReplaceAroundStep) {
          const { from, to } = step;

          newState.doc.nodesBetween(from, to, (node, pos) => {
            if (changedTask) {
              return false;
            }

            if (node.type.name !== TaskItem.name) {
              return;
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
      }

      if (!changedTask) {
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
