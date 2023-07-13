import parseDuration from 'parse-duration';

export const checkIfUsernameTaken = cachedFunction(async (username: string) => {
  if (!username)
    return false;

  username = username.trim();

  const prisma = getPrisma();

  const user = await prisma.user.findFirst({ where: { username }, select: { username: true } })
    .catch(() => null);

  return !!user?.username;
}, {
  swr: true,
  maxAge: parseDuration('1 day', 'second'),
  staleMaxAge: parseDuration('2 weeks', 'second'),
  getKey: (username: string) => `${username?.trim()}-taken`,
});
