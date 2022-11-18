import { getCookie, setCookie } from 'h3';
import type { H3Event } from 'h3';
import type { User } from '@prisma/client';

import getPrisma from '~/prisma';

// NOTE: just for testing purposes
// will be replaced with actual function
function generateAccessToken(object: object): string {
  const stringifiedObject = stringifyUserObject(object);

  return Buffer.from(stringifiedObject).toString('base64');
}

function getAccessTokenName(): string {
  const { authCookiePrefix } = useRuntimeConfig().public;

  return `${authCookiePrefix}-access-token`;
}

export function stringifyUserObject(user: User | object): string {
  return JSON.stringify(
    user,
    (_key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  );
}

export function setAuthCookies(event: H3Event, user: Pick<User, 'id' | 'username' | 'email'>) {
  const accessToken = generateAccessToken(user);
  const accessTokenName = getAccessTokenName();

  const oneHour = 60 * 60;

  setCookie(event, accessTokenName, accessToken, {
    path: '/',
    sameSite: 'lax',
    maxAge: oneHour,
  });
}

export async function getUserFromEvent(event: H3Event): Promise<Pick<User, 'id' | 'username' | 'email'> | null> {
  const accessTokenName = getAccessTokenName();
  const encodedAccessToken = getCookie(event, accessTokenName);

  if (!encodedAccessToken) return null;

  const stringifiedAccessToken = Buffer.from(encodedAccessToken, 'base64').toString('utf-8');

  let accessToken: User | null;

  try {
    accessToken = JSON.parse(stringifiedAccessToken);
  }
  catch {
    return null;
  }

  if (accessToken === null) return null;
  if (!accessToken.username) return null;

  const prisma = getPrisma();

  let user: Pick<User, 'id' | 'email' | 'username'> | null;

  try {
    user = await prisma.user.findUnique({
      where: { username: accessToken.username },
      select: { id: true, username: true, email: true },
    });
  }
  catch {
    return null;
  }

  return user;
}
