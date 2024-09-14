import type { DB } from './db/types';
import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';

import postgres from 'postgres';

export function getKysely() {
  if (!globalThis.__kysely) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be defined');
    }

    globalThis.__kysely = new Kysely<DB>({
      log: ['error'],
      dialect: new PostgresJSDialect({
        postgres: postgres(process.env.DATABASE_URL, {
          // This causing some issues with _kysely_ only, yet postgresjs seems to be working fine
          // with cockroach ?
          // fetch_types: false,
        }),
      }),
    });
  }

  return globalThis.__kysely;
}

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __kysely: Kysely<DB>;
}
