const USER_CACHE_BASE = 'user';

export enum UserCacheGroup {
  Recent = 'recent',
  Taken = 'taken',
}

export function getUserCacheKey(username: string, group: UserCacheGroup) {
  if (!username)
    throw new Error('unexpected empty username');
  if (!group)
    throw new Error('unexpected empty group');

  return `${username.trim()}:${group}`;
}

export const checkIfUsernameTaken = defineCachedFunction(checkIfUsernameTaken_, {
  base: USER_CACHE_BASE,
  swr: true,
  maxAge: parseDuration('6 months', 'second'),
  getKey: (username: Parameters<typeof checkIfUsernameTaken_>[0]) => getUserCacheKey(username, UserCacheGroup.Taken),
});

export const getRecentForUser = defineCachedFunction(getRecentForUser_, {
  base: USER_CACHE_BASE,
  swr: true,
  maxAge: parseDuration('5 minutes', 's'),
  staleMaxAge: parseDuration('30 minutes', 's'),
  getKey: (user: Parameters<typeof getRecentForUser_>[0]) => getUserCacheKey(user.username, UserCacheGroup.Recent),
});

async function checkIfUsernameTaken_(username: string) {
  if (!username)
    return false;

  username = username.trim();

  const prisma = getPrisma();

  const user = await prisma.user.findFirst({ where: { username }, select: { username: true } })
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
