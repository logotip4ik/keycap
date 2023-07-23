import process from 'node:process';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { DB } from './types';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __kysely: Kysely<DB> | undefined;
}

const dialect = new PostgresDialect({
  pool: async () => new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export function getKysely() {
  if (!globalThis.__kysely) {
    globalThis.__kysely = new Kysely({
      dialect,
      // plugins: [new DeduplicateJoinsPlugin()],
    });
  }

  return globalThis.__kysely;
}
