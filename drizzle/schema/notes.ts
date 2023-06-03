import { bigint, pgTable, text, time, varchar } from 'drizzle-orm/pg-core';

import { folders } from './folders';

export const notes = pgTable('Note', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull(),

  name: varchar('name', { length: 50 }).notNull(),
  content: text('content'),
  path: text('path').notNull(),

  ownerId: bigint('ownerId', { mode: 'bigint' })
    .notNull(),
  parentId: bigint('parentId', { mode: 'bigint' })
    .references(() => folders.id).notNull(),

  createdAt: time('createdAt').defaultNow().notNull(),
  updatedAt: time('updatedAt').notNull(),
});
