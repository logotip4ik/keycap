import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

import type { H3Event } from 'h3';
import type { Prisma } from '@prisma/client';

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

export function toBigInt(string: string): bigint {
  if (string.at(-1) === 'n')
    return BigInt(string.substring(0, string.length - 1));

  let res = BigInt(-1);

  try {
    res = BigInt(string);
  }
  catch { }

  return res;
}

export function getNoteSelectParamsFromEvent(event: H3Event): Prisma.NoteSelect {
  const query = getQuery(event);

  const isGetNoteQuery = typeof query.getNote !== 'undefined';
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

  if (isMethod(event, 'PATCH')) {
    if (isGetNoteQuery)
      return defaultSelects;
    else
      return { id: true };
  }

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

  return defaultSelects;
}

export function getIdentifierFromEvent(event: H3Event) {
  return getHeader(event, 'x-real-ip')
    || getHeader(event, 'client-ip')
    || getHeader(event, 'x-forwarded-for');
}
