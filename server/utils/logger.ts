import type { H3Event } from 'h3';

export type LoggerData = Record<string, unknown | undefined>;

export const LOG_LEVEL = {
  info: 'info',
  warn: 'warn',
  error: 'error',
} as const;

let client: typeof $fetch;

// NOTE: maybe we should keep only one instance of logger
// but then we need to provide `event` on each log ?
export function createLogger(event: H3Event) {
  const { axiom } = useRuntimeConfig();
  const [path, query] = event.path.split('?');

  if (!client) {
    client = $fetch.create({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-ndjson',
        'Authorization': `Bearer ${axiom.token}`,
        'User-Agent': 'keycap/server',
        'X-Axiom-Org-Id': axiom.orgId,
      },
      method: 'POST',
      baseURL: 'https://api.axiom.co',
      ignoreResponseError: true,
    });
  }

  const additionalData: LoggerData = {
    nitro: true,
    env: process.env.VERCEL_ENV || 'development',

    path,
    query,
    username: event.context.user?.username,
  };

  const log = baseLog.bind(additionalData, axiom.dataset, additionalData);

  return {
    log,

    async error(data: LoggerData | string, message?: string) {
      data = typeof data === 'string' ? { msg: data } : data;

      if (message)
        data.msg = message;

      await log(LOG_LEVEL.error, data);
    },

    async warn(data: LoggerData | string, message?: string) {
      data = typeof data === 'string' ? { msg: data } : data;

      if (message)
        data.msg = message;

      await this.log(LOG_LEVEL.warn, data);
    },

    async info(data: LoggerData | string, message?: string) {
      data = typeof data === 'string' ? { msg: data } : data;

      if (message)
        data.msg = message;

      await this.log(LOG_LEVEL.info, data);
    },
  };
}

async function baseLog(dataset: string, baseData: LoggerData, level: keyof typeof LOG_LEVEL, customData: LoggerData) {
  const data = Object.assign({}, baseData, customData);

  data.level = level;
  data._time = new Date().toISOString();

  if (data.err) {
    data.err = Object.assign({}, data.err, {
      message: (data.err as any).message,
      stack: (data.err as any).stack,
    });
  }

  if (data.error) {
    data.error = Object.assign({}, data.error, {
      message: (data.error as any).message,
      stack: (data.error as any).stack,
    });
  }

  // avg log is 369.543ms pretty long :(
  await client(`/v1/datasets/${dataset}`, { body: data })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('that was unexpected', err);
    });
}
