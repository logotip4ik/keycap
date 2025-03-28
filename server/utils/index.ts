import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

export const currentItemNameRE = /[\w%.!]+$/;
// Pulled straight from zod source
export const emailRE = /^(?!\.)(?!.+\.\.)([\w'+\-.]*)[\w+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
export const serverUserAgent = import.meta.prod ? process.env.SERVER_NAME || 'Keycap' : `${process.env.SERVER_NAME || 'Keycap'} Dev`;

export function generateFolderPath(username: string, path: string): string {
  // prepending leading slash to username + leading slash path + remove trailing slash
  return withoutTrailingSlash(`${withLeadingSlash(username)}${withLeadingSlash(path)}`);
}

export function generateNotePath(username: string, path: string): string {
  return generateFolderPath(username, path);
}

export function generateRootFolderPath(username: string) {
  return `/${username}`;
}

export function makeNewItemPath(currentPath: string, newName: string): string {
  return currentPath.replace(currentItemNameRE, encodeURIComponent(newName));
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('item name validation', () => {
    it('valid names', () => {
      let name = 'something like this';
      expect(allowedItemNameRE.test(name)).toBeTruthy();

      name = 'som_4hing-like.this';
      expect(allowedItemNameRE.test(name)).toBeTruthy();

      const allowedSymbols = ['&', '#', '!'];

      for (const symbol of allowedSymbols) {
        name = `test${symbol}`;
        expect(allowedItemNameRE.test(name)).toBeTruthy();
      }
    });

    it('not valid names', () => {
      let name = 's';
      expect(allowedItemNameRE.test(name)).toBeFalsy();

      const disalloedSymbols = ['(', '%', '$', '*', '@'];

      for (const symbol of disalloedSymbols) {
        name = `test${symbol}`;
        expect(allowedItemNameRE.test(name)).toBeFalsy();
      }
    });
  });

  describe('new item.path generation', () => {
    it('correctly generated new note path', () => {
      let currentPath = '/with%20note';
      let newPath = makeNewItemPath(currentPath, 'new name');
      expect(newPath).toEqual('/new%20name');

      currentPath = '/folder/with%20note';
      newPath = makeNewItemPath(currentPath, 'new name');
      expect(newPath).toEqual('/folder/new%20name');

      currentPath = '/something%204.0';
      newPath = makeNewItemPath(currentPath, 'something 5.0');
      expect(newPath).toEqual('/something%205.0');

      currentPath = '/in%20folder/folder%201/abc%202.0';
      newPath = makeNewItemPath(currentPath, 'abc 2.1');
      expect(newPath).toEqual('/in%20folder/folder%201/abc%202.1');
    });
  });
}
