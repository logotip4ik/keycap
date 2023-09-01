import type { H3Event } from 'h3';
import type { RuntimeConfig } from 'nuxt/schema';

export type LoggerData = Record<string, any | undefined>;

export const LOG_LEVEL = {
  info: 'info',
  warn: 'warn',
  error: 'error',
} as const;

class Logger {
  #userAgent = 'keycap/server'; // official sdk sets `axiom-js/0.13.0` where 0.13.0 is version
  #datasetEndpoint = '/v1/datasets';
  #datasetUrl: string;

  #client: typeof $fetch;
  #data: LoggerData;
  #config: RuntimeConfig['axiom'];

  constructor(opts: { data: LoggerData; config: RuntimeConfig['axiom'] }) {
    const { config, data } = opts;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-ndjson',
      'Authorization': `Bearer ${config.token}`,
      'User-Agent': this.#userAgent,
      'X-Axiom-Org-Id': config.orgId,
    };

    this.#data = data;
    this.#config = config;
    this.#datasetUrl = `${this.#datasetEndpoint}/${this.#config.dataset}/ingest`;

    this.#client = $fetch.create({
      headers,
      method: 'POST',
      baseURL: 'https://api.axiom.co',
      ignoreResponseError: true,
    });
  }

  async log(level: keyof typeof LOG_LEVEL, data: LoggerData) {
    Object.assign(data, this.#data);

    data.level = level;
    data._time = new Date().toISOString();

    if (data.error) {
      data.error = Object.assign({}, data.error, {
        message: data.error.message,
        stack: data.error.stack,
      });
    }

    if (data.err) {
      data.err = Object.assign({}, data.err, {
        message: data.err.message,
        stack: data.err.stack,
      });
    }

    // avg log is 369.543ms pretty long :(
    await this.#client(this.#datasetUrl, { body: data })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('that was unexpected', err);
      });
  }

  async error(data: LoggerData | string, message?: string) {
    data = typeof data === 'string' ? { msg: data } : data;

    if (message)
      data.msg = message;

    await this.log(LOG_LEVEL.error, data);
  }

  async warn(data: LoggerData | string, message?: string) {
    data = typeof data === 'string' ? { msg: data } : data;

    if (message)
      data.msg = message;

    await this.log(LOG_LEVEL.warn, data);
  }

  async info(data: LoggerData | string, message?: string) {
    data = typeof data === 'string' ? { msg: data } : data;

    if (message)
      data.msg = message;

    await this.log(LOG_LEVEL.info, data);
  }
}

// NOTE: maybe we should keep only one instance of logger
// but then we need to provide `event` on each log ?
export function createLogger(event: H3Event) {
  const { axiom } = useRuntimeConfig(event);
  const [path, query] = event.path.split('?');

  const additionalData: LoggerData = {
    nitro: true,
    env: process.env.VERCEL_ENV || 'development',

    path,
    query,
    username: event.context.user?.username,
  };

  return new Logger({ data: additionalData, config: axiom });
}
