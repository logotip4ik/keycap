import { relations, sql } from 'drizzle-orm';
import { bigint, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { user } from './user';
import { share } from './share';
import { folder } from './folder';

export const note = pgTable('Note', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull().default(sql`unique_rowid()`),

  name: varchar('name', { length: 150 }).notNull(),
  content: text('content'),
  path: text('path').unique(),

  ownerId: bigint('ownerId', { mode: 'bigint' }).notNull().references(() => user.id),
  parentId: bigint('parentId', { mode: 'bigint' }).notNull().references(() => folder.id),

  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const noteRelations = relations(note, ({ one, many }) => ({
  owner: one(user, {
    fields: [note.ownerId],
    references: [user.id],
  }),

  parent: one(folder, {
    fields: [note.parentId],
    references: [folder.id],
  }),

  shares: many(share),
}));
