import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';

import type { DB as Database } from './db/types';

export function getKysely() {
  if (!globalThis.__kysely) {
    if (!process.env.DATABASE_URL)
      throw new Error('DATABASE_URL must be defined');

    globalThis.__kysely = new Kysely<Database>({
      dialect: new PostgresJSDialect({
        postgres: import.meta.dev
          ? postgres(process.env.DATABASE_URL, { database: 'postgres' })
          : postgres(process.env.DATABASE_URL),
      }),
    });
  }

  return globalThis.__kysely;
}

declare global {
  var __kysely: Kysely<Database>;
}
