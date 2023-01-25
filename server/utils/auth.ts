import { deleteCookie, getCookie, setCookie } from 'h3';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

import type { H3Event } from 'h3';
import type { User } from '@prisma/client';

import { toBigInt } from '.';

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
  const { authCookiePrefix } = useRuntimeConfig().public;

  return `${authCookiePrefix}-access-token`;
}

function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || '';

  return new TextEncoder().encode(secret);
}

function getJWTIssuer(): string {
  const issuer = process.env.JWT_ISSUER || 'test:keycap';

  return issuer;
}

export async function setAuthCookies(event: H3Event, user: Pick<User, 'id' | 'username' | 'email'>) {
  const accessToken = await generateAccessToken(user);
  const accessTokenName = getAccessTokenName();

  const twentyFourHours = 60 * 60 * 24;

  setCookie(event, accessTokenName, accessToken, {
    path: '/',
    sameSite: 'strict',
    maxAge: twentyFourHours,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function removeAuthCookies(event: H3Event) {
  const accessTokenName = getAccessTokenName();

  deleteCookie(event, accessTokenName);
}

export async function getUserFromEvent(event: H3Event): Promise<Pick<User, 'id' | 'username' | 'email'> | null> {
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
  const hashedPass = await bcrypt.hash(pass, 10);

  return hashedPass;
}

export async function verifyPassword(hashedPass: string, pass: string): Promise<boolean> {
  return bcrypt.compare(pass, hashedPass);
}
