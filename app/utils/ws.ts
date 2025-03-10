import type { ShallowReactive } from 'vue';

import proxy from 'unenv/runtime/mock/proxy';

export type WSState = 'OPEN' | 'CLOSED' | 'CONNECTING';
type Context = ShallowReactive<{
  ws: WebSocket | undefined
  state: WSState
}>;

let context: Context;

export function getZeenkWs() {
  if (import.meta.server) {
    return proxy as {
      ws: ComputedRef<Context['ws']>
      state: ComputedRef<Context['state']>
    };
  }

  if (!context) {
    context = shallowReactive({
      ws: undefined,
      state: 'CONNECTING',
    });

    init(context);
  }

  return {
    ws: computed(() => context.ws),
    state: computed(() => context.state),
  };
}

const RETRY_DELAY = parseDuration('3s')!;
const MAX_RETRIES = 3;
let offs: Array<() => void> = [];

function init(context: Context, retry: number = 0) {
  invokeArrayFns(offs);

  if (retry > MAX_RETRIES) {
    return;
  }

  const { zeenkSite } = useRuntimeConfig().public;
  const proto = import.meta.prod ? 'wss://' : 'ws://';

  try {
    const ws = new WebSocket(proto + zeenkSite);

    context.ws = ws;
    context.state = 'CONNECTING';

    offs = [
      on(ws, 'open', () => {
        retry = 0;
        context.state = 'OPEN';

        if (import.meta.dev) {
          // eslint-disable-next-line no-console
          console.info('zeenk connected.');
        }
      }, { once: true, passive: true }),

      on(ws, 'close', () => {
        context.state = 'CLOSED';

        setTimeout(init, RETRY_DELAY, context, retry + 1);
      }, { once: true, passive: true }),
    ];
  }
  catch (e) {
    sendError(e as Error, { msg: 'couldn\'t connect to zeenk' });
    setTimeout(init, RETRY_DELAY, context, retry + 1);
  }
}
