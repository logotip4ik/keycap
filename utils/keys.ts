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
  invariant(size == null || size < 12, 'Min key size is 12');

  return `${prefix}_${nanoid(size)}`;
}
