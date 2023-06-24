import pino from 'pino';
import { isProduction } from 'std-env';

import type { Logger } from 'pino';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var logger: Logger | undefined;
}

export function createLogger(): Logger {
  if (globalThis.logger)
    return globalThis.logger;

  const token = useRuntimeConfig().logtailSourceToken as string;

  const transport = pino.transport({
    // @ts-expect-error it wants me to put `sourceToken` field in `pino-pretty.options`
    targets: [
      {
        level: 'trace',
        target: 'pino-pretty',
        options: { },
      },

      isProduction && {
        level: 'error',
        target: '@logtail/pino',
        options: { sourceToken: token },
      },
    ].filter(Boolean),
  });

  globalThis.logger = pino(transport);

  return globalThis.logger;
}
