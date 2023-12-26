import parseDuration from 'parse-duration';

export async function checkIfUsernameTaken(username: string) {
  if (!username)
    return false;

  username = username.trim();

  const prisma = getPrisma();

  const user = await prisma.user.findFirst({ where: { username }, select: { username: true } })
    .catch(() => {});

  return !!user?.username;
}

export function getUsernameTakenKey(username: string) {
  if (!username)
    throw new Error('unexpected empty username');

  return `${username.trim()}-taken`;
}

export const checkIfUsernameTakenCached = cachedFunction(checkIfUsernameTaken, {
  swr: true,
  maxAge: parseDuration('6 months', 'second'),
  getKey: getUsernameTakenKey,
});
