import Pino from 'pino';
import PinoPretty from 'pino-pretty';
import { isDevelopment } from 'std-env';

import type { Logger } from 'pino';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var logger: Logger | undefined;
}

export function createLogger(): Logger {
  if (globalThis.logger)
    return globalThis.logger;

  globalThis.logger = Pino(
    PinoPretty({
      minimumLevel: isDevelopment ? 'trace' : (process.env.LOG_LEVEL || 'warn') as Pino.Level,
    }),
  );

  return globalThis.logger;
}
