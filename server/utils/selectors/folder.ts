import type { Prisma } from '@prisma/client';

export function defineFolderSelectors<T extends Record<string, Prisma.FolderSelect>>(selectors: T) {
  return selectors;
}
