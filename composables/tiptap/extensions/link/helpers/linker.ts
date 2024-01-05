const urlRE_G = /(?<!\+)https?:\/\/(?:www\.)?(?:[-\w.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*/g;

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
  while ((res = urlRE_G.exec(text)) !== null) {
    links.push({
      type: 'url',
      start: res.index,
      end: urlRE_G.lastIndex,
      href: res[0],
      value: res[0],
    });
  }

  return links;
}

export function isWorkspaceHref(href: string) {
  const user = useUser();

  return user.value && href.includes(`/@${user.value.username}`)
}

export function getItemNameFromHref(href: string) {
  const parts = href.split('/')

  if (parts.at(-1) === BLANK_NOTE_NAME) {
    parts.pop()
  }

  return decodeURIComponent(parts.at(-1) || "")
}
