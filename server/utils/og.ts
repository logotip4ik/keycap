import { sha256base64 } from 'ohash';

export const OG_CACHE_GROUP = 'og';

export enum OgCacheName {
  NoteDetails = 'note_details',
}

export function getOgCacheKey(identifier: string, cacheName?: OgCacheName) {
  if (!identifier)
    throw new Error('unexpected empty username');

  const usernameHash = sha256base64(identifier.trim());

  if (!cacheName)
    return usernameHash;

  return `cache:${OG_CACHE_GROUP}:${cacheName}:${usernameHash}.json`;
}

export const getNoteDetailsByLink = defineCachedFunction(getNoteDetailsByLink_, {
  group: OG_CACHE_GROUP,
  name: OgCacheName.NoteDetails,

  swr: true,
  maxAge: parseDuration('1 week', 's'),
  staleMaxAge: parseDuration('1 month', 's'),
  getKey: (link: string) => getOgCacheKey(link),
});

async function getNoteDetailsByLink_(link: string) {
  const prisma = getPrisma();

  return prisma.note.findFirst({
    select: { name: true, updatedAt: true, createdAt: true },
    where: { shares: { some: { link } } },
  });
}
