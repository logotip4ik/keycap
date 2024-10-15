import type { NuxtApp } from '#app';

export { defaultProtocol } from '~/server/utils/index';
export { LogLevel } from '~/server/utils/logger';

export const stringifiedBigIntRE = /^(\d{1,19})$/;

const falsyBigInt = BigInt(-1);
export function toBigInt(string: string): bigint {
  return stringifiedBigIntRE.test(string) ? BigInt(string) : falsyBigInt;
}

export function getHydrationPromise(nuxtApp: NuxtApp = useNuxtApp()): undefined | Promise<unknown> {
  if (!nuxtApp.isHydrating) {
    return;
  }

  return new Promise((r) => nuxtApp.hooks.hookOnce('app:suspense:resolve', r));
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('toBigInt', () => {
    expect(toBigInt('77777777777777777')).toEqual(BigInt('77777777777777777'));
    expect(toBigInt('77777777777777777asd')).toEqual(BigInt(-1));
  });
}
