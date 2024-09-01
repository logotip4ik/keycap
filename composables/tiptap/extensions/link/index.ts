import { Mark, PasteRule, mergeAttributes } from '@tiptap/core';

import type { PasteRuleMatch } from '@tiptap/core';
import type { MarkType } from '@tiptap/pm/model';

import { autolink } from './helpers/autolink';
import { clickHandler } from './helpers/clickHandler';
import { find, isWorkspaceUrl } from './helpers/linker';

export interface LinkOptions {
  username: string | undefined
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
    const username = useUser().value?.username;

    return {
      username,
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
    return [{ tag: 'a[href]:not([href *= "javascript:" i])' }];
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
        // eslint-disable-next-line unicorn/consistent-function-scoping
        () => ({ chain }) => {
          return chain()
            .unsetMark(this.name, { extendEmptyMarkRange: true })
            .setMeta('preventAutolink', true)
            .run();
        },
    };
  },

  addPasteRules() {
    return makePasteRules({ type: this.type, username: this.options.username });
  },

  addProseMirrorPlugins() {
    return [
      autolink({ type: this.type }),
      clickHandler({ type: this.type }),
    ];
  },
});

function makePasteRules(config: { type: MarkType, username: string | undefined }) {
  return [
    new PasteRule({
      find: (text) => find(text)
        .map((link): PasteRuleMatch => ({
          index: link.start,
          text: link.href,
          data: link,
        })),
      handler: ({ match, state, range }) => {
        const attrs = { href: match[0] };

        const { tr } = state;

        const markStart = range.from;
        const markEnd = markStart + attrs.href.length;

        if (isWorkspaceUrl(new URL(attrs.href), config.username)) {
          tr.replaceRangeWith(
            markStart,
            markEnd,
            state.schema.text(
              getItemPathFromHref(attrs.href),
              [config.type.create(attrs)],
            ),
          );
        }
        else {
          tr.addMark(markStart, markEnd, config.type.create(attrs));
        }

        tr.removeStoredMark(config.type);
      },
    }),
  ];
}
