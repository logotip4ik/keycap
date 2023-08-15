import { sql } from 'drizzle-orm';
import { bigint, boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

import { user } from './user';

export const folder = pgTable('Folder', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull().default(sql`unique_rowid()`),

  name: varchar('name', { length: 150 }).notNull(),
  path: varchar('path', { length: 100 }).notNull().unique(),
  root: boolean('root').notNull().default(false),

  ownerId: bigint('ownerId', { mode: 'bigint' }).notNull().references(() => user.id),
  parentId: bigint('parentId', { mode: 'bigint' }).references((): AnyPgColumn => folder.id),

  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
