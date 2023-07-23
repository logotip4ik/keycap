import parseDuration from 'parse-duration';

export const checkIfUsernameTaken = cachedFunction(async (username: string) => {
  if (!username)
    return false;

  username = username.trim();

  const kysely = getKysely();

  const user = await kysely
    .selectFrom('User')
    .select('username')
    .where('username', '=', username)
    .executeTakeFirst();

  return !!user?.username;
}, {
  swr: true,
  maxAge: parseDuration('1 day', 'second'),
  staleMaxAge: parseDuration('2 weeks', 'second'),
  getKey: (username: string) => `${username?.trim()}-taken`,
});
