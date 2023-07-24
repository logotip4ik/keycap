import process from 'node:process';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { DB } from './types';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __kysely: Kysely<DB> | undefined;
  // eslint-disable-next-line vars-on-top, no-var
  var __pg: Pool | undefined;
}

async function getPgPool() {
  if (!globalThis.__pg) {
    globalThis.__pg = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1,
      allowExitOnIdle: true,
    });
  }

  return globalThis.__pg;
}

const dialect = new PostgresDialect({
  pool: getPgPool,
});

export function getKysely() {
  if (!globalThis.__kysely) {
    globalThis.__kysely = new Kysely({
      dialect,
      log: ['error'],
    });
  }

  return globalThis.__kysely;
}
