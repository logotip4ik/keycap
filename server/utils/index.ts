import { SocialAuth } from '@prisma/client';
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

import type { H3Event } from 'h3';
import type { Prisma } from '@prisma/client';

// escaping `-` and `|` because it is used on client side and browsers don't like it unescaped
// NOTE: do not forget to change same RE in client side
export const allowedItemNameRE = /^[\w .&#!|\-\u0404-\u0457]{2,50}$/;
export const currentItemNameRE = /[\w%.!]+$/;
export const usernameRE = /^[\w.\-]{3,16}$/;
export const OAuthProvider = SocialAuth;
export const serverUserAgent = import.meta.prod ? process.env.SERVER_NAME || 'Keycap' : `${process.env.SERVER_NAME || 'Keycap'} Dev`;

export { toBigInt, stringifiedBigIntRE } from '~/utils';

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

export function getNoteSelectParamsFromEvent(event: H3Event): Prisma.NoteSelect {
  const query = getQuery(event);

  const isDetailsRequest = typeof query.details !== 'undefined';

  const defaultSelects = { id: true, name: true, content: true, path: true };

  if (isMethod(event, 'GET') && isDetailsRequest) {
    return {
      // TODO: ability to add multiple shares to one note ?
      shares: { take: 1, select: { link: true, updatedAt: true, createdAt: true } },
      updatedAt: true,
      createdAt: true,
    };
  }

  if (isMethod(event, 'PATCH'))
    return { id: true };

  return defaultSelects;
}

export function getFolderSelectParamsFromEvent(event: H3Event): Prisma.FolderSelect {
  const query = getQuery(event);

  const isDetailsRequest = typeof query.details !== 'undefined';

  const defaultSelects = { id: true, name: true, path: true, root: true };

  if (isMethod(event, 'GET')) {
    if (isDetailsRequest) {
      return { updatedAt: true, createdAt: true };
    }
    else {
      return {
        ...defaultSelects,

        notes: {
          select: { id: true, name: true, path: true },
          orderBy: { name: 'asc' },
        },

        subfolders: {
          select: { ...defaultSelects },
          orderBy: { name: 'asc' },
        },
      };
    }
  }

  if (isMethod(event, 'PATCH'))
    return { id: true };

  return defaultSelects;
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
