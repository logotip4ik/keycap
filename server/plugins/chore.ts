import '~/polyfills/array-at';

function toJSON(this: bigint) {
  return `${this.toString()}n`;
}

// eslint-disable-next-line no-extend-native
Object.defineProperty(
  BigInt.prototype,
  'toJSON',
  {
    value: toJSON,
    writable: true,
    enumerable: false,
    configurable: true,
  },
);

export default defineNitroPlugin(() => undefined);
