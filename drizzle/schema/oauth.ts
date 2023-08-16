import { pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { user } from './user';

export const socialAuthEnum = pgEnum('SocialAuth', ['Google', 'GitHub']);

export const oauth = pgTable('OAuth', {
  id: varchar('id').primaryKey().notNull(),

  type: socialAuthEnum('type'),

  userId: serial('userId').notNull().references(() => user.id),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const oauthRelations = relations(oauth, ({ one }) => ({
  user: one(user, {
    fields: [oauth.userId],
    references: [user.id],
  }),
}));
