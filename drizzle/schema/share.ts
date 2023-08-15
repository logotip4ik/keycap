import { sql } from 'drizzle-orm';
import { bigint, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { user } from './user';
import { note } from './note';

export const share = pgTable('Share', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull().default(sql`unique_rowid()`),

  link: varchar('link', { length: 21 }).notNull().unique(),

  noteId: bigint('noteId', { mode: 'bigint' }).notNull().references(() => note.id),
  ownerId: bigint('ownerId', { mode: 'bigint' }).notNull().references(() => user.id),

  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
