/* eslint-disable @typescript-eslint/no-invalid-this */
import { setSuretypeOptions } from 'suretype';

import '~/polyfills/array-at';

function toJSON() {
  // @ts-expect-error this should work ಠ_ಠ
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

setSuretypeOptions({ colors: false, location: false });

export default defineNitroPlugin(() => undefined);
