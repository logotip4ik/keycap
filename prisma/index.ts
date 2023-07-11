import { PrismaClient } from '@prisma/client';
import { isDevelopment } from 'std-env';

import type { Prisma } from '@prisma/client';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!globalThis.prisma) {
    const log: Prisma.LogLevel[] = isDevelopment
      ? ['info', 'error', 'warn', 'query']
      : ['info', 'error'];

    globalThis.prisma = new PrismaClient({ log });
  }

  return globalThis.prisma;
}
