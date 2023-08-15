import { read } from 'rc9';
import type { Config } from 'drizzle-kit';

const config = read('.env');

export default {
  driver: 'pg',
  dbCredentials: {
    connectionString: config.DATABASE_URL!,
  },
} satisfies Config;
