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
    {
      level: isDevelopment ? 'trace' : (process.env.LOG_LEVEL || 'warn') as Pino.Level,
      mixin: (obj) => {
        // @ts-expect-error marking as nitro log
        obj.nitro = true;

        return obj;
      },
    },
    PinoPretty(),
  );

  return globalThis.logger;
}
