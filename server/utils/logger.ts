import type { H3Event } from 'h3';
import type { ValueOf } from 'type-fest';

export interface LoggerData extends Record<string, unknown | undefined> {
  msg?: string | undefined
  err?: Error | undefined
  error?: Error | undefined
}
export interface Logger {
  error: (event: H3Event, data: LoggerData | string) => Promise<void>
  warn: (event: H3Event, data: LoggerData | string) => Promise<void>
  info: (event: H3Event, data: LoggerData | string) => Promise<void>
}

let client: typeof $fetch | undefined;
function getAxiomClient(axiom: ReturnType<typeof useRuntimeConfig>['axiom']) {
  if (client) {
    return client;
  }

  client = $fetch.create({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-ndjson',
      'Authorization': `Bearer ${axiom.token}`,
      'User-Agent': serverUserAgent,
    },
    method: 'POST',
    baseURL: axiom.baseUrl,
  });

  return client;
}

async function log(event: H3Event, level: ValueOf<typeof LogLevel>, data: LoggerData) {
  const [path, query] = event.path.split('?');

  Object.assign(data, {
    path,
    query,
    user: event.context.user,

    level,
    _time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });

  if (data.nitro === undefined) {
    data.nitro = true;
  }

  if (data.err) {
    data.err = Object.assign(Object.create(null), data.err, {
      message: (data.err as any).message,
      stack: (data.err as any).stack,
    });
  }
  else if (data.error) {
    data.error = Object.assign(Object.create(null), data.error, {
      message: (data.error as any).message,
      stack: (data.error as any).stack,
    });
  }

  if (import.meta.dev) {
    // eslint-disable-next-line no-console
    return console.dir(data);
  }

  const { axiom } = useRuntimeConfig();
  const client = getAxiomClient(axiom);

  await client(`/v1/datasets/${axiom.dataset}/ingest`, { body: data })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('that was unexpected', err);
      // eslint-disable-next-line no-console
      console.dir({ data });
    });
}

export const logger = {
  async error(event: H3Event, data: LoggerData | string) {
    await log(event, LogLevel.Error, typeof data === 'string' ? { msg: data } : data);
  },

  async warn(event: H3Event, data: LoggerData | string) {
    await log(event, LogLevel.Warn, typeof data === 'string' ? { msg: data } : data);
  },

  async info(event: H3Event, data: LoggerData | string) {
    await log(event, LogLevel.Info, typeof data === 'string' ? { msg: data } : data);
  },
} satisfies Logger;
