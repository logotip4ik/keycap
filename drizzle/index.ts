import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres('postgresql://root@localhost:26257/keycap?sslmode=disable');
const db = drizzle(client);

export function getDrizzle(): typeof db {
  if (!globalThis.drizzle)
    globalThis.drizzle = db;

  return globalThis.drizzle;
}
