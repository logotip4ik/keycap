import { sha256base64 } from 'ohash';

export const USER_CACHE_GROUP = 'user';

export enum UserCacheName {
  Recent = 'recent',
  Taken = 'taken',
}

export function getUserCacheKey(username: string, cacheName?: UserCacheName) {
  if (!username)
    throw new Error('unexpected empty username');

  const usernameHash = sha256base64(username.trim());

  if (!cacheName)
    return usernameHash;

  return `cache:${USER_CACHE_GROUP}:${cacheName}:${usernameHash}.json`;
}

export const checkIfUsernameTaken = defineCachedFunction(checkIfUsernameTaken_, {
  group: USER_CACHE_GROUP,
  name: UserCacheName.Taken,

  swr: true,
  maxAge: parseDuration('6 months', 'second'),
  getKey: (username: Parameters<typeof checkIfUsernameTaken_>[0]) => getUserCacheKey(username),
});

export const getRecentForUser = defineCachedFunction(getRecentForUser_, {
  group: USER_CACHE_GROUP,
  name: UserCacheName.Recent,

  swr: true,
  maxAge: parseDuration('5 minutes', 's'),
  staleMaxAge: parseDuration('30 minutes', 's'),
  getKey: (user: Parameters<typeof getRecentForUser_>[0]) => getUserCacheKey(user.username),
});

async function checkIfUsernameTaken_(username: string) {
  if (!username)
    return false;

  username = username.trim();

  const prisma = getPrisma();

  const user = await prisma.user.findFirst({
    where: { username },
    select: { username: true },
  })
    .catch(() => {});

  return !!user?.username;
}

async function getRecentForUser_(user: { id: bigint, username: string }) {
  const prisma = getPrisma();

  // TODO: more advanced recent algorithm :P
  return await prisma.note.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true, path: true },
    take: 4,
    orderBy: { updatedAt: 'desc' },
  });
}
