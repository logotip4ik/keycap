import { isProduction } from 'std-env';
import { SocialAuth } from '@prisma/client';
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

import type { H3Event } from 'h3';
import type { Prisma } from '@prisma/client';

export const usernameRE = /^[\w.\-]{3,16}$/;
export const currentItemNameRE = /[\w%.]+$/;
export const OAuthProvider = SocialAuth;

export { toBigInt, stringifiedBigIntRE } from '~/utils';

export function getServerUserAgent() {
  const postfix = isProduction ? '' : 'Dev';
  const serverName = process.env.SERVER_NAME || 'Keycap';

  return `${serverName} ${postfix}`.trim();
}

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
