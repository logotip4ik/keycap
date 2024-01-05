import { Mark, markPasteRule, mergeAttributes } from '@tiptap/core';

import { autolink } from './helpers/autolink';
import { clickHandler } from './helpers/clickHandler';
import { find } from './helpers/linker';

export interface LinkOptions {
  HTMLAttributes: Record<string, any>
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

/**
 * All credits to original Link extension
 * https://github.com/ueberdosis/tiptap/tree/main/packages/extension-link
 */
export const Link = Mark.create<LinkOptions>({
  name: 'link',

  priority: 1000,

  keepOnSplit: false,

  inclusive() {
    return true;
  },

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
    // False positive; we're explicitly checking for javascript: links to ignore them
    if (HTMLAttributes.href?.startsWith('javascript:')) {
      // strip out the href
      return ['a', mergeAttributes(this.options.HTMLAttributes, { ...HTMLAttributes, href: '' }), 0];
    }

    if (HTMLAttributes.href?.startsWith(window.location.origin)) {
      const user = useUser();

      if (user.value && HTMLAttributes.href?.includes(`/@${user.value.username}`))
        HTMLAttributes['data-inner'] = true
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
    return [
      markPasteRule({
        find: (text) => find(text)
          .map((link) => ({
            text: link.value,
            index: link.start,
            data: link,
          })),
        type: this.type,
        getAttributes: (match) => ({
          href: match.data?.href,
        }),
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      autolink({ type: this.type }),
      clickHandler({ type: this.type }),
    ];
  },
});
