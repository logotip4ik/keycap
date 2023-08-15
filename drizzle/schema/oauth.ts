import { pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { user } from './user';

export const socialAuthEnum = pgEnum('SocialAuth', ['Google', 'GitHub']);

export const oauth = pgTable('OAuth', {
  id: varchar('id').primaryKey().notNull(),

  type: socialAuthEnum('type'),

  userId: serial('userId').notNull().references(() => user.id),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
