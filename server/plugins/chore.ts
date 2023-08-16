import { setSuretypeOptions } from 'suretype';

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

setSuretypeOptions({ colors: false, location: false });

// TODO: test if prisma.$connect and $disconnect improves performance
export default defineNitroPlugin((nitro) => {
  const prisma = getPrisma();

  prisma.$connect();

  nitro.hooks.hookOnce('close', async () => {
    const prisma = getPrisma();

    await prisma.$disconnect();
  });
});
