import { sql } from 'drizzle-orm';
import { bigint, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().notNull().default(sql`unique_rowid()`),

  email: varchar('email', { length: 75 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  password: varchar('password', { length: 50 }),

  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
