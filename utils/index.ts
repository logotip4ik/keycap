import type { NuxtApp } from '#app';

export const stringifiedBigIntRE = /^(\d{18})$/;
export const allowedClientItemNameRE = /^[\w .&#!\|\-\u0404-\u0457]{2,50}\/?$/; // eslint-disable-line regexp/no-useless-escape
// NOTE: do not forget to change same RE in nitro side

const falsyBigInt = BigInt(-1);
export function toBigInt(string: string): bigint {
  return stringifiedBigIntRE.test(string) ? BigInt(string) : falsyBigInt;
}

export function getHydrationPromise(app?: NuxtApp): false | undefined | Promise<unknown> {
  const nuxtApp = app || useNuxtApp();

  return nuxtApp.isHydrating === true
    && new Promise((r) => nuxtApp.hooks.hookOnce('app:suspense:resolve', r));
}

/* #__NO_SIDE_EFFECTS__ */
export function devError<T>(msg: string): T {
  if (import.meta.dev) {
    throw new Error(msg);
  }

  return new Promise((r) => r(undefined)) as T;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('toBigInt', () => {
    expect(toBigInt('77777777777777777')).toEqual(BigInt(-1));
    expect(toBigInt('777777777777777777')).not.toEqual(BigInt(-1));
  });
}
