import type { ShallowReactive } from 'vue';
import proxy from 'unenv/runtime/mock/proxy';

type WebSocketState = 'connecting' | 'open' | 'closed';

interface Event {
  type: keyof ZeenkEvents
  payload?: unknown
}

interface ZeenkEvents {
  'update-note': { path: string, steps: Array<unknown> }
};

interface Zeenk {
  state: ComputedRef<WebSocketState>

  send: <T extends keyof ZeenkEvents>(type: T, payload: ZeenkEvents[T]) => void
  on: <T extends keyof ZeenkEvents>(type: T, cb: (payload: ZeenkEvents[T]) => void) => void
}

let offs: Array<() => void> = [];
const _buffer: Array<Event> = [];
let context: ShallowReactive<{
  ws: WebSocket | undefined
  state: WebSocketState
}>;

export function useZeenk(): Zeenk {
  if (import.meta.server) {
    return proxy as Zeenk;
  }

  const scope = getCurrentScope()!;

  let listeners: Partial<Record<keyof ZeenkEvents, (payload: ZeenkEvents[keyof ZeenkEvents]) => void>> = {};

  const init = () => {
    invokeArrayFns(offs);

    const { zeenkUrl } = useRuntimeConfig().public;
    const proto = import.meta.prod ? 'wss://' : 'ws://';

    context = shallowReactive({
      ws: new WebSocket(proto + zeenkUrl),
      state: 'connecting',
    });

    offs = [
      on(context.ws!, 'open', () => {
        const ws = context.ws!;

        context.state = 'open';

        for (const event of _buffer) {
          send(ws, event);
        }

        _buffer.length = 0;

        // this wont work with two components
        // maybe move this offs to watcher ?
        scope.run(() => {
          for (const [type, cb] of Object.entries(listeners)) {
            onScopeDispose(
              listen(ws, type as keyof ZeenkEvents, cb),
            );
          }

          listeners = {};
        });
      }, { once: true }),

      on(context.ws!, 'close', () => {
        // TODO: reconnect
      }, { once: true }),
    ];
  };

  if (!context) {
    init();
  }

  return {
    state: computed(() => context.state),

    send: (type, payload) => {
      if (context.state === 'open' && context.ws) {
        send(context.ws, { type, payload });
      }
      else {
        _buffer.push({ type, payload });
      }
    },

    on: (type, cb) => {
      if (context.state === 'open' && context.ws) {
        onScopeDispose(
          listen(context.ws, type, cb),
        );
      }
      else {
        listeners[type] = cb;
      }
    },
  };
}

function send(ws: WebSocket, event: Event) {
  ws.send(JSON.stringify(event));
}

function listen<T extends keyof ZeenkEvents>(
  ws: WebSocket,
  type: T,
  cb: (payload: ZeenkEvents[T]) => void,
) {
  return on(ws, 'message', (e) => {
    const event = parseMessage(e.data);

    if (event && event.type === type) {
      cb(event.payload as ZeenkEvents[T]);
    }
  });
}

function parseMessage(message: string) {
  let event: Event | undefined;

  try {
    const parsed = JSON.parse(message);

    if (typeof parsed === 'object' && parsed && 'type' in parsed) {
      event = {
        type: parsed.type as keyof ZeenkEvents,
        // @ts-expect-error this can be undefined
        payload: parsed.payload,
      };
    }
    else if (import.meta.dev) {
      console.error('Invalid message format:', parsed);
    }
  }
  catch {
    if (import.meta.dev) {
      console.error('Couldn\'t parse message:', message);
    }
  }

  return event;
}
