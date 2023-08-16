import { relations, sql } from 'drizzle-orm';
import { bigint, boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

import { user } from './user';
import { note } from './note';

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

export const folderRelations = relations(folder, ({ one, many }) => ({
  notes: many(note),

  subfolders: many(folder, { relationName: 'subfolders' }),

  parent: one(folder, {
    fields: [folder.parentId],
    references: [folder.id],
    relationName: 'subfolders',
  }),

  owner: one(user, {
    fields: [folder.ownerId],
    references: [user.id],
  }),
}));
