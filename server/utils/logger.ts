import pino from 'pino';
import { isProduction } from 'std-env';

import type { Logger } from 'pino';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var _logger: Logger | undefined;
}

export function createLogger() {
  if (globalThis._logger)
    return globalThis._logger;

  const { axiom } = useRuntimeConfig();

  globalThis._logger = pino({
    mixin() {
      return { nitro: true };
    },
    transport: {
      level: isProduction ? 'info' : 'trace',
      target: isProduction ? '@axiomhq/pino' : 'pino-pretty',
      // eslint-disable-next-line github/no-dataset
      options: { token: axiom.apiToken, dataset: axiom.dataset },
    },
  });

  return globalThis._logger;
}
