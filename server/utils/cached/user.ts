import type { H3Event } from 'h3';
import type { ValueOf } from 'type-fest';

import { sha256base64 } from 'ohash';
import invariant from 'tiny-invariant';

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

  swr: false,
  maxAge: parseDuration('6 months', 'second')!,
  getKey: (...params: Parameters<typeof checkIfUsernameTaken_>) => getUserCacheKey(params[1]),
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
