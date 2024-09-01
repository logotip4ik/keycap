const urlRE = /(?<!\+)https?:\/\/(?:www\.)?(?:[-\w.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*/g;

export interface Link {
  type: string
  start: number
  end: number
  href: string
  value: string
}

export function find(text: string) {
  const links: Array<Link> = [];
  let res;

  // eslint-disable-next-line no-cond-assign
  while ((res = urlRE.exec(text)) !== null) {
    links.push({
      type: 'url',
      start: res.index,
      end: urlRE.lastIndex,
      href: res[0],
      value: res[0],
    });
  }

  return links;
}

export function isWorkspaceUrl(url: URL, username: string | undefined) {
  return username
    && url.origin === window.location.origin
    && url.pathname.startsWith(`/@${username}`);
}
