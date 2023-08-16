import { relations, sql } from 'drizzle-orm';
import { bigint, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { note } from './note';
import { share } from './share';
import { folder } from './folder';
import { oauth } from './oauth';

export const user = pgTable('User', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull().default(sql`unique_rowid()`),

  email: varchar('email', { length: 75 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  password: varchar('password', { length: 50 }),

  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  notes: many(note),
  shares: many(share),
  folders: many(folder),
  socials: many(oauth),
}));
