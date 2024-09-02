import { Plugin, PluginKey } from '@tiptap/pm/state';

import type { MarkType } from '@tiptap/pm/model';

interface ClickHandlerOptions {
  type: MarkType
};

export function clickHandler(_options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handleClickLink'),
    props: {
      handleClick: (_view, _pos, event) => {
        const link = event.target as HTMLLinkElement;

        // TODO: add auto complete for inner links
        if (!link || link.nodeName !== 'A') {
          return false;
        }

        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        if (href) {
          const innerUrl = getInnerUrl(href);

          if (innerUrl) {
            navigateTo(innerUrl.pathname);
          }
          else {
            window.open(href, target || undefined);
          }

          return true;
        }

        return false;
      },
    },
  });
}

function getInnerUrl(link: string) {
  const url = new URL(link);

  if (window.location.origin !== url.origin) {
    return;
  }

  const user = useUser();

  if (!user.value || !url.pathname.startsWith(`/@${user.value.username}`)) {
    return;
  }

  return url;
}
