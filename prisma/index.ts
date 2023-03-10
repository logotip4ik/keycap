import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
}

export default () => {
  if (!global.prisma) global.prisma = new PrismaClient();

  return global.prisma;
};
