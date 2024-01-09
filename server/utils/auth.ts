import { deleteCookie, getCookie, setCookie } from 'h3';
import { SignJWT, jwtVerify } from 'jose';
import { withoutProtocol } from 'ufo';
import parseDuration from 'parse-duration';

import type { H3Event } from 'h3';
import type { CookieSerializeOptions } from 'cookie-es';

import { isJwtPayload } from './validators/jwt';
import { toBigInt } from './index';

import type { SafeUser } from '~/types/server';

const authExpiration = parseDuration('3 days', 'second')!;
const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || '');
const jwtIssuer = process.env.JWT_ISSUER || 'test:keycap';
const accessTokenName = import.meta.prod ? '__Host-keycap-user' : 'keycap-user';

// https://web.dev/first-party-cookie-recipes/#the-good-first-party-cookie-recipe
const authSerializeOptions: CookieSerializeOptions = {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: import.meta.prod,
  maxAge: authExpiration,
};

async function generateAccessToken(object: Record<string, unknown>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const { id, ...rest } = object;

  if (!id)
    throw new Error('id should be defined');

  return await new SignJWT(rest)
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(createKey(KeyPrefix.Jwt))
    .setSubject(id as string)
    .setIssuedAt()
    .setExpirationTime(now + authExpiration)
    .setIssuer(jwtIssuer)
    .sign(jwtSecret);
}

export async function setAuthCookies(event: H3Event, user: SafeUser) {
  const accessToken = await generateAccessToken(user);

  setCookie(event, accessTokenName, accessToken, authSerializeOptions);
}

export async function removeAuthCookies(event: H3Event) {
  deleteCookie(event, accessTokenName, authSerializeOptions);
}

export async function getUserFromEvent(event: H3Event): Promise<SafeUser | null> {
  const accessToken = getCookie(event, accessTokenName);

  if (!accessToken)
    return null;

  const { payload } = await jwtVerify(accessToken, jwtSecret, { issuer: jwtIssuer })
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'jwt verification failed' });

      return {} as { payload: undefined };
    });

  if (isJwtPayload(payload)) {
    return {
      id: toBigInt(payload.sub),
      email: payload.email,
      username: payload.username,
    };
  }
  else {
    return null;
  }
}

export function checkOriginForMismatch(event: H3Event) {
  const host = getRequestHost(event);
  const origin = getRequestHeader(event, 'Origin') || '';

  return withoutProtocol(origin) !== host;
}
