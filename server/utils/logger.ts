import { isDevelopment, isProduction } from 'std-env';

import * as winston from 'winston';
import { WinstonTransport as AxiomTransport } from '@axiomhq/axiom-node';

let loggerInstance: winston.Logger;

export function createLogger() {
  if (loggerInstance)
    return loggerInstance;

  const { combine, errors, json } = winston.format;

  loggerInstance = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(errors({ stack: true }), json()),
    defaultMeta: { service: 'nitro' },
  });

  if (isProduction) {
    const { axiomApiToken, axiomDataset, axiomOrgId } = useRuntimeConfig();

    const axiom = new AxiomTransport({
      orgId: axiomOrgId,
      token: axiomApiToken,
      dataset: axiomDataset,
    });

    // @ts-expect-error eeeeeeeeeeee, idk, hope it will work
    loggerInstance.add(axiom);
    // @ts-expect-error eeeeeeeeeeee, idk, hope it will work
    loggerInstance.exceptions.handle(axiom);
    // @ts-expect-error eeeeeeeeeeee, idk, hope it will work
    loggerInstance.rejections.handle(axiom);
  }

  // Add the console logger if we're not in production
  if (isDevelopment) {
    loggerInstance.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }

  return loggerInstance;
}
