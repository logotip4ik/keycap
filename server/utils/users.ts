import parseDuration from 'parse-duration';

export const checkIfUsernameTaken = cachedFunction(async (username: string) => {
  username = username.trim();

  const prisma = getPrisma();

  const user = await prisma.user.findFirst({ where: { username }, select: { username: true } })
    .catch(() => null);

  return !!user?.username;
}, {
  maxAge: parseDuration('15 minutes', 'second'),
  getKey: (username: string) => `${username.trim()}-taken`,
});
