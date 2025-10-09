import { Plugin, PluginKey } from '@tiptap/pm/state';

interface ClickHandlerOptions {
  username: string | undefined
};

export function clickHandler({ username }: ClickHandlerOptions): Plugin {
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
          const innerUrl = username && getInnerUrl(username, href);

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

function getInnerUrl(username: string, link: string) {
  const url = new URL(link);

  if (window.location.origin !== url.origin) {
    return;
  }

  if (!url.pathname.startsWith(`/@${username}`)) {
    return;
  }

  return url;
}
