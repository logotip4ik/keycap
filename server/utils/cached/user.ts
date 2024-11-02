import type { H3Event } from 'h3';
import type { ValueOf } from 'type-fest';

import { sha256base64 } from 'ohash';

export const USER_CACHE_GROUP = 'user';

export const UserCacheName = {
  Recent: 'recent',
  Taken: 'taken',
} as const;

export function getUserCacheKey(username: string, cacheName?: ValueOf<typeof UserCacheName>) {
  invariant(username, 'Username must not be empty');

  const usernameHash = sha256base64(username.trim());

  if (!cacheName) {
    return usernameHash;
  }

  return `cache:${USER_CACHE_GROUP}:${cacheName}:${usernameHash}.json`;
}

export const checkIfUsernameTaken = defineCachedFunction(checkIfUsernameTaken_, {
  group: USER_CACHE_GROUP,
  name: UserCacheName.Taken,

  maxAge: parseDuration('6 months', 'second'),
  getKey: (...params: Parameters<typeof checkIfUsernameTaken_>) => getUserCacheKey(params[1]),
});

export const getRecentForUser = defineCachedFunction(getRecentForUser_, {
  group: USER_CACHE_GROUP,
  name: UserCacheName.Recent,

  swr: true,
  maxAge: parseDuration('5 minutes', 's'),
  staleMaxAge: parseDuration('1 week', 's'),
  getKey: (...params: Parameters<typeof getRecentForUser_>) => getUserCacheKey(params[1].username),
});

async function checkIfUsernameTaken_(_event: H3Event, username: string) {
  if (!username) {
    return false;
  }

  username = username.trim();

  const kysely = getKysely();

  const user = await kysely
    .selectFrom('User')
    .where('username', '=', username)
    .select((eb) => eb.lit(true).as('exists'))
    .executeTakeFirst();

  return user?.exists === true;
}

function getRecentForUser_(_event: H3Event, user: { id: string, username: string }) {
  const kysely = getKysely();

  // TODO: more advanced recent algorithm :P
  return kysely
    .selectFrom('Note')
    .where('ownerId', '=', user.id)
    .select(['id', 'name', 'path'])
    .limit(4)
    .orderBy('updatedAt desc')
    .execute();
}
