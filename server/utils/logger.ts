import pino from 'pino';
import PinoAxiom from '@axiomhq/pino';
import PinoPretty from 'pino-pretty';
import { isProduction } from 'std-env';

import type { Logger } from 'pino';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var _logger: Logger | undefined;
}

export async function createLogger() {
  if (globalThis._logger)
    return globalThis._logger;

  const { axiom } = useRuntimeConfig();

  const stream = isProduction
    ? await PinoAxiom({
      token: axiom.apiToken,
      // eslint-disable-next-line github/no-dataset
      dataset: axiom.dataset,
    })
    : PinoPretty();

  globalThis._logger = pino({
    mixin() {
      return { nitro: true };
    },
  }, stream);

  return globalThis._logger;
}
