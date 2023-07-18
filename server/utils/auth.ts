import { getCookie, setCookie } from 'h3';
import { SignJWT, jwtVerify } from 'jose';
import { isDevelopment, isProduction } from 'std-env';
import * as bcrypt from '@node-rs/bcrypt';
import parseDuration from 'parse-duration';

import type { H3Event } from 'h3';

import { toBigInt } from '.';

import type { SafeUser } from '~/types/server';

const AUTH_EXPIRATiON = parseDuration('4 days', 'second')!;

async function generateAccessToken(object: object): Promise<string> {
  const secret = getJWTSecret();
  const issuer = getJWTIssuer();
  const now = Math.floor(new Date().getTime() / 1000);

  return await new SignJWT({ ...object })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime(now + AUTH_EXPIRATiON)
    .sign(secret);
}

function getAccessTokenName(): string {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#cookie_prefixes
  const prefix = isDevelopment ? '' : '__Host-';

  return `${prefix}keycap-user`;
}

function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || '';

  return new TextEncoder().encode(secret);
}

function getJWTIssuer(): string {
  const issuer = process.env.JWT_ISSUER || 'test:keycap';

  return issuer;
}

export async function setAuthCookies(event: H3Event, user: SafeUser) {
  const accessTokenName = getAccessTokenName();
  const accessToken = await generateAccessToken(user);

  // https://web.dev/first-party-cookie-recipes/#the-good-first-party-cookie-recipe
  setCookie(event, accessTokenName, accessToken, {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: isProduction,
    maxAge: AUTH_EXPIRATiON,
  });
}

export async function removeAuthCookies(_event: H3Event) {
  // noop
}

export async function getUserFromEvent(event: H3Event): Promise<SafeUser | null> {
  const accessTokenName = getAccessTokenName();
  const accessToken = getCookie(event, accessTokenName);

  if (!accessToken) return null;

  const secret = getJWTSecret();
  const issuer = getJWTIssuer();

  const { payload } = await jwtVerify(accessToken, secret, { issuer }).catch(() => null) || {};

  if (!payload)
    return null;

  return {
    id: toBigInt(payload.id as string),
    email: payload.email as string,
    username: payload.username as string,
  };
}

export async function hashPassword(pass: string): Promise<string> {
  return await bcrypt.hash(pass, 10);
}

export async function verifyPassword(hashedPass: string, pass: string): Promise<boolean> {
  return await bcrypt.compare(pass, hashedPass);
}

export function checkOriginForMismatch(event: H3Event) {
  const reqUrl = getRequestURL(event);
  const origin = getHeader(event, 'origin');

  // https://github.com/sveltejs/kit/blob/21272ee81d915b1049c4ba1ab981427fac232e80/packages/kit/src/runtime/server/respond.js#L56
  return reqUrl.origin !== origin;
}
