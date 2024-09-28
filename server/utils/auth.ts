import type { CookieSerializeOptions } from 'cookie-es';

import type { H3Event } from 'h3';
import { jwtVerify, SignJWT } from 'jose';

import type { SafeUser } from '~/types/server';

const authExpiration = parseDuration('3 days', 'second')!;
const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || '');
const jwtIssuer = process.env.JWT_ISSUER || 'test:keycap';
const accessTokenName = import.meta.prod ? '__Secure-keycap-user' : 'keycap-user';
const site = process.env.NUXT_PUBLIC_SITE || 'localhost';

// https://web.dev/first-party-cookie-recipes/#the-good-first-party-cookie-recipe
const authSerializeOptions: CookieSerializeOptions = {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: import.meta.prod,
  maxAge: authExpiration,
  domain: site, // Need this to share auth cookie with sync server
};

function generateAccessToken(object: Record<string, unknown>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const { id, ...rest } = object;

  if (!id) {
    throw new Error('id should be defined');
  }

  return new SignJWT(rest)
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

export async function deleteAuthCookies(event: H3Event) {
  deleteCookie(event, accessTokenName, authSerializeOptions);
}

export async function getUserFromEvent(event: H3Event): Promise<SafeUser | undefined> {
  // TODO: remove in next release
  const accessToken = getCookie(event, accessTokenName) || getCookie(event, '__Host-keycap-user');

  if (!accessToken) {
    return;
  }

  const jwt = await jwtVerify(accessToken, jwtSecret, { issuer: jwtIssuer }).catch(() => undefined);

  if (jwt && jwtPayloadValidator.Check(jwt.payload)) {
    return {
      id: jwt.payload.sub,
      email: jwt.payload.email,
      username: jwt.payload.username,
    };
  }
}

const protocol = import.meta.prod ? 'https://' : 'http://';
const validOrigin = import.meta.config.vercelEnv === 'production'
  ? protocol + process.env.NUXT_PUBLIC_SITE
  : protocol + process.env.VERCEL_URL;

export function isOriginMismatched(event: H3Event) {
  const origin = getRequestHeader(event, 'Origin');

  return origin !== validOrigin;
}
