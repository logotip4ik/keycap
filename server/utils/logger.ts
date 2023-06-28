import { isDevelopment, isProduction } from 'std-env';

// @ts-expect-error allowSyntheticDefaultImports is actually enabled
import winston from 'winston';
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
      handleExceptions: true,
      handleRejections: true,
    });

    loggerInstance.add(axiom);

    try {
      console.log(loggerInstance.log('warn', 'test warning'));
    }
    catch (error) {
      console.log(error);
    }
  }

  if (isDevelopment) {
    loggerInstance.add(
      new winston.transports.Console(),
    );
  }

  return loggerInstance;
}
