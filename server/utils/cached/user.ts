import { sha256base64 } from 'ohash';

import type { ValueOf } from 'type-fest';

export const USER_CACHE_GROUP = 'user';

export const UserCacheName = {
  Recent: 'recent',
  Taken: 'taken',
} as const;

export function getUserCacheKey(username: string, cacheName?: ValueOf<typeof UserCacheName>) {
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

  const kysely = getKysely();

  const user = await kysely
    .selectFrom('User')
    .where('username', '=', username)
    .executeTakeFirst();

  return user !== undefined;
}

async function getRecentForUser_(user: { id: string, username: string }) {
  const kysely = getKysely();

  // TODO: more advanced recent algorithm :P
  return await kysely
    .selectFrom('Note')
    .where('ownerId', '=', user.id)
    .select(['id', 'name', 'path'])
    .limit(4)
    .orderBy('updatedAt desc')
    .execute();
}
