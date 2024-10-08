import type { ValueOf } from 'type-fest';
import { customAlphabet } from 'nanoid';

export const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 24);
export const KeyPrefix = {
  Build: 'build',
  Jwt: 'jwt',
  OAuthState: 'oauth_state',
  Link: 'link',
  Register: 'rgstr',
} as const;

export function createKey(prefix: ValueOf<typeof KeyPrefix>, size?: number) {
  if (typeof size === 'number' && size < 12) {
    throw new Error('key length is too small');
  }

  return `${prefix}_${nanoid(size)}`;
}
