/* eslint-disable @typescript-eslint/no-invalid-this */

/* @see https://github.com/tc39/proposal-relative-indexing-method#polyfill */

function at(n: number) {
  n = Math.trunc(n) || 0;

  // @ts-expect-error from official repo
  if (n < 0) n += this.length;

  // @ts-expect-error from official repo
  if (n < 0 || n >= this.length) return undefined;

  // @ts-expect-error from official repo
  return this[n];
}

for (const C of [Array, String]) {
  Object.defineProperty(
    C.prototype,
    'at',
    {
      value: at,
      writable: true,
      enumerable: false,
      configurable: true,
    },
  );
}
