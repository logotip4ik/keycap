// escaping `-` and `|` because it is used on client side and browsers don't like it unescaped
export const allowedItemNameRE = /^[\w .&#!\|\-\u0404-\u0457]{2,50}$/; // eslint-disable-line regexp/no-useless-escape
export const usernameRE = /^[\w.\-]{3,16}$/;
export const stringifiedBigIntRE = /^(\d{1,19})$/;

export const defaultProtocol = import.meta.prod ? 'https://' : 'http://';

export { SocialAuth as oAuthProvider } from '~~/kysely/db/types';

export const LogLevel = {
  Info: 'info',
  Warn: 'warn',
  Error: 'error',
} as const;
