const urlRE = /(?<!\+)https?:\/\/(?:www\.)?(?:[-\p{Letter}.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w\p{Letter}.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*/gu;

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

export function isWorkspaceUrl(url: URL, username: string) {
  return url.origin === window.location.origin
    && url.pathname.startsWith(`/@${username}`);
}

const lastBlankNoteNameRE = new RegExp(`/${BLANK_NOTE_NAME}$`);
export function getRelativeItemPath(href: string, username: string) {
  return href
    .substring(2 + username.length + 1)
    .replace(lastBlankNoteNameRE, '');
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('getItemPathFromHref', () => {
    it('should return correct path from item path', () => {
      const username = 'help';
      const notePath = '/@help/me';

      expect(getRelativeItemPath(notePath, username)).toEqual('me');

      // this probably shouldn't be allowed...
      const folderPath = '/@help/me/_blank/_blank';

      expect(getRelativeItemPath(folderPath, username)).toEqual('me/_blank');
    });
  });
}
