import { bigint, boolean, pgTable, time, varchar } from 'drizzle-orm/pg-core';

import type { AnyPgColumn } from 'drizzle-orm/pg-core';

export const folders = pgTable('Folder', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull(),

  name: varchar('name', { length: 50 }).notNull(),
  path: varchar('path', { length: 100 }).notNull(),
  root: boolean('root').default(false).notNull(),

  parentId: bigint('parentId', { mode: 'bigint' })
    .references((): AnyPgColumn => folders.id),

  ownerId: bigint('ownerId', { mode: 'bigint' })
    .notNull(),

  createdAt: time('createdAt').defaultNow().notNull(),
  updatedAt: time('updatedAt').notNull(),
});
