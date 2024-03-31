import { Mark, PasteRule, mergeAttributes } from '@tiptap/core';

import type { PasteRuleMatch } from '@tiptap/core';
import type { MarkType } from '@tiptap/pm/model';

import { autolink } from './helpers/autolink';
import { clickHandler } from './helpers/clickHandler';
import { find, getItemNameFromHref, isWorkspaceHref } from './helpers/linker';

export interface LinkOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    link: {
      /**
       * Set a link mark
       */
      setLink: (attributes: { href: string, target?: string | null, rel?: string | null, class?: string | null }) => ReturnType
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes: { href: string, target?: string | null, rel?: string | null, class?: string | null }) => ReturnType
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
    return {
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        class: null,
      },
    };
  },

  addAttributes() {
    return {
      href: { default: null },
      target: { default: this.options.HTMLAttributes.target },
      rel: { default: this.options.HTMLAttributes.rel },
      class: { default: this.options.HTMLAttributes.class },
    };
  },

  parseHTML() {
    return [{ tag: 'a[href]:not([href *= "javascript:" i])' }];
  },

  renderHTML({ HTMLAttributes }) {
    if (!HTMLAttributes.href || !validLinkStartRE.test(HTMLAttributes.href)) {
      return ['a', mergeAttributes(this.options.HTMLAttributes, { ...HTMLAttributes, href: '' }), 0];
    }

    if (
      HTMLAttributes.href?.startsWith(window.location.origin)
      && isWorkspaceHref(HTMLAttributes.href)
    ) {
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

  addPasteRules() {
    return makePasteRules({ type: this.type });
  },

  addProseMirrorPlugins() {
    return [
      autolink({ type: this.type }),
      clickHandler({ type: this.type }),
    ];
  },
});

function makePasteRules(config: { type: MarkType }) {
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
        const isInnerLink = attrs.href.startsWith(window.location.origin) && isWorkspaceHref(attrs.href);

        const { tr } = state;

        const markStart = range.from;
        const markEnd = markStart + attrs.href.length;

        if (isInnerLink) {
          tr.replaceRangeWith(
            markStart,
            markEnd,
            state.schema.text(
              getItemNameFromHref(attrs.href),
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
