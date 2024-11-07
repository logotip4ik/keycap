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

const falsyBigInt = BigInt(-1);
export function toBigInt(string: string): bigint {
  return stringifiedBigIntRE.test(string) ? BigInt(string) : falsyBigInt;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('toBigInt', () => {
    expect(toBigInt('77777777777777777')).toEqual(BigInt('77777777777777777'));
    expect(toBigInt('77777777777777777asd')).toEqual(BigInt(-1));
  });
}
