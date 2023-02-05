import { getCookie, setCookie } from 'h3';
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
  return 'Authorization';
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
  const accessTokenName = getAccessTokenName();
  const accessToken = await generateAccessToken(user);

  const twentyFourHours = 60 * 60 * 24;

  setCookie(event, accessTokenName, toBearerValue(accessToken), {
    path: '/',
    sameSite: 'strict',
    maxAge: twentyFourHours,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function removeAuthCookies(event: H3Event) {
  setCookie(event, 'WWW-Authorization', toBearerValue('realm="access to keycap user"'));
}

export async function getUserFromEvent(event: H3Event): Promise<Pick<User, 'id' | 'username' | 'email'> | null> {
  const accessTokenName = getAccessTokenName();
  const accessToken = getCookie(event, accessTokenName);

  if (!accessToken) return null;

  const secret = getJWTSecret();
  const issuer = getJWTIssuer();

  try {
    const { payload } = await jwtVerify(fromBearerValue(accessToken), secret, { issuer });

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

export function toBearerValue(token: string) {
  return `Bearer ${token}`;
}

export function fromBearerValue(headerValue: string) {
  return headerValue.split(' ')[1].trim();
}
