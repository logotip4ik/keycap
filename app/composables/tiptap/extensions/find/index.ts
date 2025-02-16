import type { Node } from '@tiptap/pm/model';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    find: {
      hideAllMatches: () => ReturnType
      findNextMatch: (
        match: string,
        opts?: { from?: number, retainPastMatchesOnNotFound?: boolean }
      ) => ReturnType
      findPreviousMatch: (
        match: string,
        opts?: { to?: number, retainPastMatchesOnNotFound?: boolean }
      ) => ReturnType
    }
  }
}

interface Storage {
  decorations: Array<Decoration>
}

export const FindPluginKey = new PluginKey('find');
export const Find = Extension.create({
  name: 'find',

  addStorage(): Storage {
    return {
      decorations: [],
    };
  },

  addCommands() {
    return {
      hideAllMatches: () => () => {
        (this.storage as Storage).decorations.length = 0;
        return true;
      },

      findNextMatch: (matcher, opts) => ({ state }) => {
        const isCaseSensitiveSearch = hasUpperCaseLetter(matcher);

        const from = opts?.from || 0;

        let matchedPos: { nodeStart: number, from: number } | undefined;
        state.doc.descendants((node, pos) => {
          if (matchedPos || pos + node.nodeSize < from) {
            return false;
          }

          const content = textContent(node, !isCaseSensitiveSearch);

          const off = Math.max(from, pos) - pos;
          const index = content.indexOf(matcher, off);
          if (index !== -1) {
            matchedPos = {
              nodeStart: pos,
              from: index,
            };
            return false;
          }
        });

        if (matchedPos) {
          const start = matchedPos.nodeStart + matchedPos.from + 1;
          const findDecoration = Decoration.inline(
            start,
            start + matcher.length,
            { class: 'quick-find__result' },
          );
          (this.storage as Storage).decorations = [
            findDecoration,
          ];
        }
        else if (!opts?.retainPastMatchesOnNotFound) {
          (this.storage as Storage).decorations.length = 0;
        }

        return true;
      },

      findPreviousMatch: (matcher, opts) => ({ state }) => {
        const isCaseSensitiveSearch = hasUpperCaseLetter(matcher);

        const to = opts?.to || state.doc.content.size;

        let matchedPos: { nodeStart: number, from: number } | undefined;
        state.doc.descendants((node, pos) => {
          if (pos > to) {
            return false;
          }

          let content = textContent(node, isCaseSensitiveSearch);
          if (pos + node.nodeSize > to) {
            content = content.substring(0, to - pos);
          }

          const index = content.lastIndexOf(matcher);
          if (index !== -1) {
            matchedPos = {
              nodeStart: pos,
              from: index,
            };
          }
        });

        if (matchedPos) {
          const start = matchedPos.nodeStart + matchedPos.from + 1;
          const findDecoration = Decoration.inline(
            start,
            start + matcher.length,
            { class: 'quick-find__result' },
          );
          (this.storage as Storage).decorations = [
            findDecoration,
          ];
        }
        else if (!opts?.retainPastMatchesOnNotFound) {
          (this.storage as Storage).decorations.length = 0;
        }

        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    const storage = this.storage as Storage;
    return [
      new Plugin({
        key: FindPluginKey,

        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr) {
            if (storage.decorations.length === 0) {
              return DecorationSet.empty;
            }

            return DecorationSet.create(tr.doc, storage.decorations.slice());
          },
        },

        props: {
          decorations(state) {
            if (storage.decorations.length === 0) {
              return undefined;
            }

            return this.getState(state);
          },
        },
      }),
    ];
  },
});

function hasUpperCaseLetter(str: string) {
  for (const char of str) {
    const code = char.codePointAt(0)!;
    if (code >= 65 && code <= 90) {
      return true;
    }
  }
  return false;
}

const TextContentCache = new WeakMap<Node, string>();
function textContent(node: Node, lowercase?: boolean) {
  const cached = TextContentCache.get(node);

  if (cached) {
    return lowercase ? cached.toLowerCase() : cached;
  }

  let content = '';
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child.isText) {
      content += child.text!;
    }
    else if (child.isLeaf) {
      content += '\uFFFC';
    }
    else {
      content += ` ${textContent(child)} `;
    }
  }

  TextContentCache.set(node, content);

  return lowercase ? content.toLowerCase() : content;
}
