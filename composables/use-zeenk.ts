import proxy from 'unenv/runtime/mock/proxy';

interface Event {
  type: keyof ZeenkEvents
  payload?: unknown
}

interface ZeenkEvents {
  'update-note': { path: string, steps: Array<unknown> }
};

interface Zeenk {
  state: ComputedRef<WSState>

  send: <T extends keyof ZeenkEvents>(type: T, payload: ZeenkEvents[T]) => void
  on: <T extends keyof ZeenkEvents>(type: T, cb: (payload: ZeenkEvents[T]) => void) => void
}

export function useZeenk(): Zeenk {
  if (import.meta.server) {
    return proxy as Zeenk;
  }

  const { ws, state } = getZeenkWs();

  const _buffer: Array<Event> = [];
  const _listeners: Partial<Record<keyof ZeenkEvents, (p: ZeenkEvents[keyof ZeenkEvents]) => void>> = {};

  const scope = getCurrentScope()!;
  watch(() => state.value, (state) => {
    const websocket = ws.value;

    if (state === 'OPEN' && websocket) {
      for (const event of _buffer) {
        send(websocket, event);
      }

      _buffer.length = 0;

      for (const _type in _listeners) {
        const type = _type as keyof ZeenkEvents;

        const cb = _listeners[type];

        delete _listeners[type];

        if (cb) {
          scope.run(() => {
            onScopeDispose(
              listen(websocket, type, cb),
            );
          });
        }
      }
    }
  });

  return {
    state,

    send: (type, payload) => {
      if (state.value === 'OPEN' && ws.value) {
        send(ws.value, { type, payload });
      }
      else {
        _buffer.push({ type, payload });
      }
    },

    on: (type, cb) => {
      if (state.value === 'OPEN' && ws.value) {
        onScopeDispose(
          listen(ws.value, type, cb),
        );
      }
      else {
        _listeners[type] = cb;
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
