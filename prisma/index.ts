import type { Prisma } from '@prisma/client';

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!globalThis.prisma) {
    const log: Array<Prisma.LogLevel> = import.meta.prod
      ? ['info', 'error']
      : ['info', 'error', 'warn'];

    globalThis.prisma = new PrismaClient({ log });
  }

  return globalThis.prisma;
}
