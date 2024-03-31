if (!Array.prototype.at) {
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
}

/* @see https://github.com/tc39/proposal-relative-indexing-method#polyfill */
function at<T>(this: Array<T> | string, n: number) {
  n = Math.trunc(n) || 0;
  if (n < 0) {
    n += this.length;
  }
  if (n < 0 || n >= this.length) {
    return undefined;
  }
  return this[n];
}
