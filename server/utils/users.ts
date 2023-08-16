import { eq } from 'drizzle-orm';
import parseDuration from 'parse-duration';

export async function checkIfUsernameTaken(username: string) {
  if (!username)
    return false;

  username = username.trim();

  const drizzle = getDrizzle();

  const user = await drizzle.query.user
    .findFirst({
      where: eq(schema.user.username, username),
      columns: { username: true },
    })
    .execute();

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
