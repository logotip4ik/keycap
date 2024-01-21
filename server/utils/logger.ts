import type { H3Event } from 'h3';

export enum LogLevel {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}
export type LoggerData = Record<string, unknown | undefined> & { msg?: string | undefined };
export interface Logger {
  log(level: LogLevel, data: LoggerData): Promise<void>
  error(data: LoggerData | string): Promise<void>
  warn(data: LoggerData | string): Promise<void>
  info(data: LoggerData | string): Promise<void>
}

let client: typeof $fetch | undefined;

export function createLogger(event: H3Event) {
  const { axiom } = useRuntimeConfig();
  const [path, query] = event.path.split('?');

  const baseData: LoggerData = {
    nitro: true,
    env: process.env.VERCEL_ENV || 'development',

    path,
    query,
    username: event.context.user?.username,
  };

  const logger: Logger = {
    async log(level: LogLevel, data: LoggerData) {
      await baseLog(axiom, baseData, level, data);
    },

    async error(data: LoggerData | string) {
      await logger.log(LogLevel.Error, typeof data === 'string' ? { msg: data } : data);
    },

    async warn(data: LoggerData | string) {
      await logger.log(LogLevel.Warn, typeof data === 'string' ? { msg: data } : data);
    },

    async info(data: LoggerData | string) {
      await logger.log(LogLevel.Info, typeof data === 'string' ? { msg: data } : data);
    },
  };

  return logger;
}

async function baseLog(
  axiom: ReturnType<typeof useRuntimeConfig>['axiom'],
  baseData: LoggerData,
  level: 'info' | 'warn' | 'error',
  customData: LoggerData = {},
) {
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

  if (!client) {
    client = $fetch.create({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-ndjson',
        'Authorization': `Bearer ${axiom.token}`,
        'User-Agent': serverUserAgent,
        'X-Axiom-Org-Id': axiom.orgId,
      },
      method: 'POST',
      baseURL: 'https://api.axiom.co',
    });
  }

  // avg log is 369.543ms pretty long :(
  await client(`/v1/datasets/${axiom.dataset}/ingest`, { body: data })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('that was unexpected', err);
    });
}
