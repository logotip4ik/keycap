import type { MarkType } from '@tiptap/pm/model';

import { Plugin, PluginKey } from '@tiptap/pm/state';

interface ClickHandlerOptions {
  type: MarkType
};

export function clickHandler(_options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handleClickLink'),
    props: {
      handleClick: (_view, _pos, event) => {
        let link = event.target as HTMLElement;

        if (
          !link
          || (
            link.nodeName !== 'A'
            && (link = link.parentElement as HTMLElement)?.nodeName !== 'A'
          )
        ) {
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

  const user = getUser();

  if (!url.pathname.startsWith(`/@${user.username}`)) {
    return;
  }

  return url;
}
