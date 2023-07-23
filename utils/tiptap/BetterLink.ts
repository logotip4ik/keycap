import { Link } from '@tiptap/extension-link';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const BetterLink = Link.extend({
  addProseMirrorPlugins() {
    return [
      clickHandler(),
    ];
  },
});

function clickHandler(_options?: any): Plugin {
  return new Plugin({
    key: new PluginKey('handleClickLink'),
    props: {
      handleClick: (view, pos, event) => {
        if (event.button !== 0)
          return false;

        const link = (event.target as HTMLLinkElement);

        const href = link?.href;
        const target = link?.target;

        if (link && href) {
          if (view.editable)
            window.open(href, target);

          return true;
        }

        return false;
      },
    },
  });
}
