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

/**
 * **Always** combine with check for correct origin!
 * @param {string} href full href or pathname
 */
export function isWorkspaceHref(href: string) {
  const user = useUser();

  return user.value && href.includes(`/@${user.value.username}`);
}
