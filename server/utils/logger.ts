import Pino from 'pino';
import PinoPretty from 'pino-pretty';
import Logtail from '@logtail/pino';
import { isDevelopment } from 'std-env';

import type { Logger } from 'pino';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var logger: Logger | undefined;
}

export async function createLogger(): Promise<Logger> {
  if (globalThis.logger)
    return globalThis.logger;

  const sourceToken = useRuntimeConfig().logtailSourceToken;

  const stream = isDevelopment
    ? PinoPretty()
    : await Logtail({ sourceToken, options: {} });

  globalThis.logger = Pino(
    {
      level: isDevelopment ? 'trace' : (process.env.LOG_LEVEL || 'warn') as Pino.Level,
      mixin: (obj) => {
        // @ts-expect-error marking as nitro log
        obj.nitro = true;

        return obj;
      },
    },
    stream,
  );

  return globalThis.logger;
}
