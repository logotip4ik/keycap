import { isDevelopment } from 'std-env';
import pino from 'pino';

import type { Logger } from 'pino';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var logger: Logger | undefined;
}

export function createLogger(): Logger {
  if (globalThis.logger)
    return globalThis.logger;

  const transport = pino.transport({
    targets: [{
      level: isDevelopment ? 'trace' : (process.env.LOG_LEVEL || 'warn'),
      target: 'pino-pretty',
      options: { },
    }],
  });

  globalThis.logger = pino(transport);

  return globalThis.logger;
}
