import type { Prisma } from '@prisma/client';

export function defineNoteSelectors<T extends Record<string, Prisma.NoteSelect>>(selectors: T) {
  return selectors;
}
