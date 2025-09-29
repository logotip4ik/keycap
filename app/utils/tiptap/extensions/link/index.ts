import type { PasteRuleMatch } from '@tiptap/core';

import type { MarkType } from '@tiptap/pm/model';
import { Mark, mergeAttributes, PasteRule } from '@tiptap/core';

import { autolink } from './helpers/autolink';
import { clickHandler } from './helpers/clickHandler';
import { find, getRelativeItemPath, isWorkspaceUrl } from './helpers/linker';

export interface LinkOptions {
  username: string
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    link: {
      /**
       * Set a link mark
       */
      setLink: (attributes: { href: string }) => ReturnType
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes: { href: string }) => ReturnType
      /**
       * Unset a link mark
       */
      unsetLink: () => ReturnType
    }
  }
}

export const validLinkStartRE = /^https?:\/\//;
let prevSelectedText: string | undefined;

/**
 * All credits to original Link extension
 * https://github.com/ueberdosis/tiptap/tree/main/packages/extension-link
 */
export const Link = Mark.create<LinkOptions>({
  name: 'link',

  priority: 1000,

  keepOnSplit: false,
  inclusive: false,
  exitable: true,

  addOptions() {
    const user = getUser();

    return {
      username: user.username,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      },
    };
  },

  addAttributes() {
    return {
      href: { default: null },
    };
  },

  parseHTML() {
    return [
      { tag: 'a[href^="http://"]' },
      { tag: 'a[href^="https://"]' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const href = HTMLAttributes.href;

    if (!href || !validLinkStartRE.test(href)) {
      return ['a', mergeAttributes(this.options.HTMLAttributes, { ...HTMLAttributes, href: '' }), 0];
    }

    if (isWorkspaceUrl(new URL(href), this.options.username)) {
      HTMLAttributes['data-inner'] = true;
    }

    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setLink:
        (attributes) => ({ chain }) => {
          return chain()
            .setMark(this.name, attributes)
            .setMeta('preventAutolink', true)
            .run();
        },

      toggleLink:
        (attributes) => ({ chain }) => {
          return chain()
            .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
            .setMeta('preventAutolink', true)
            .run();
        },

      unsetLink:
        () => ({ chain }) => {
          return chain()
            .unsetMark(this.name, { extendEmptyMarkRange: true })
            .setMeta('preventAutolink', true)
            .run();
        },
    };
  },

  onSelectionUpdate() {
    const { state } = this.editor;

    const selection = state.selection;

    prevSelectedText = selection.empty ? undefined : state.doc.textBetween(selection.from, selection.to);
  },

  addPasteRules() {
    return makePasteRules({
      type: this.type,
      username: this.options.username,
    });
  },

  addProseMirrorPlugins() {
    return [
      autolink({ type: this.type }),
      clickHandler({ type: this.type }),
    ];
  },
});

function makePasteRules(config: { type: MarkType, username: string }) {
  return [
    new PasteRule({
      find: (_, event) => {
        // sometimes text was missing last char if that char is same as in pasted link...
        // @ts-expect-error taken from mdn... https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event#live_example
        const data = (event?.clipboardData || window.clipboardData as DataTransfer | null | undefined)?.getData('text') || '';

        return find(data)
          .map((link): PasteRuleMatch => ({
            index: link.start,
            text: link.href,
            data: link,
          }));
      },
      handler: ({ match, state, range }) => {
        const attrs = { href: match[0] };

        const { tr } = state;

        const markStart = range.from;
        const markEnd = markStart + attrs.href.length;

        const link = config.type.create(attrs);

        const { username } = config;
        if (prevSelectedText || isWorkspaceUrl(new URL(attrs.href), username)) {
          tr.replaceRangeWith(
            markStart,
            markEnd,
            state.schema.text(
              prevSelectedText || getRelativeItemPath(attrs.href, username),
              [link],
            ),
          );
        }
        else {
          tr.addMark(
            markStart,
            markEnd,
            link,
          );
        }

        prevSelectedText = undefined;

        tr.removeStoredMark(config.type);
      },
    }),
  ];
}
