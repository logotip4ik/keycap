import Pino from 'pino';
import PinoAxiom from '@axiomhq/pino';
import PinoPretty from 'pino-pretty';
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

  globalThis._logger = Pino({
    mixin() {
      return { nitro: true };
    },
    transport: {
      level: isProduction ? PinoAxiom : PinoPretty,
      target: isProduction ? '@axiomhq/pino' : 'pino-pretty',
      // eslint-disable-next-line github/no-dataset
      options: { token: axiom.apiToken, dataset: axiom.dataset },
    },
  });

  return globalThis._logger;
}
