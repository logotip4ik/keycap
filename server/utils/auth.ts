import { getCookie, setCookie } from 'h3';
import { SignJWT, jwtVerify } from 'jose';
import { isDevelopment, isProduction } from 'std-env';
import * as bcrypt from '@node-rs/bcrypt';

import type { H3Event } from 'h3';

import { toBigInt } from '.';

import type { SafeUser } from '~/types/server';

async function generateAccessToken(object: object): Promise<string> {
  const secret = getJWTSecret();
  const issuer = getJWTIssuer();

  return await new SignJWT({ ...object })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime('24h')
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

  const twentyFourHours = 60 * 60 * 24;

  setCookie(event, accessTokenName, accessToken, {
    path: '/',
    sameSite: 'lax',
    maxAge: twentyFourHours,
    httpOnly: true,
    secure: isProduction,
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

  try {
    const { payload } = await jwtVerify(accessToken, secret, { issuer });

    return {
      id: toBigInt(payload.id as string),
      email: payload.email as string,
      username: payload.username as string,
    };
  }
  catch (error) {
    removeAuthCookies(event);

    return null;
  }
}

export async function hashPassword(pass: string): Promise<string> {
  return await bcrypt.hash(pass, 10);
}

export async function verifyPassword(hashedPass: string, pass: string): Promise<boolean> {
  return await bcrypt.compare(pass, hashedPass);
}
