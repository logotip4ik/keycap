import process from 'node:process';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __drizzle: PostgresJsDatabase | undefined;
}

export function getDrizzle() {
  if (!globalThis.__drizzle) {
    const queryClient = postgres(process.env.DATABASE_URL!);

    globalThis.__drizzle = drizzle(queryClient);
  }

  return globalThis.__drizzle;
}
