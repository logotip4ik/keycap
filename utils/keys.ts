import { customAlphabet } from 'nanoid';

export const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 24);
export enum KeyPrefix {
  Build,
  Jwt,
  OAuthState,
  Link,
}

const prefixes: Record<KeyPrefix, string> = {
  [KeyPrefix.Build]: 'build',
  [KeyPrefix.Jwt]: 'jwt',
  [KeyPrefix.OAuthState]: 'oauth_state',
  [KeyPrefix.Link]: 'link',
};

export function createKey(prefix: KeyPrefix, size?: number) {
  if (typeof size === 'number' && size < 12)
    throw new Error('key length is too small');

  return `${prefixes[prefix]}_${nanoid(size)}`;
}
