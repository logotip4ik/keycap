import proxy from 'unenv/runtime/mock/proxy';

interface Event {
  type: keyof ZeenkEvents
  payload?: unknown
}

interface ZeenkEvents {
  // if without steps, that means that there are too many tokens to send through zeenk
  'update-note': { path: string, steps?: Array<unknown> }

  'item-created': { path: string }

  'item-renamed': { path: string, oldPath: string }

  'item-deleted': { path: string }
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
  const _listeners: Partial<Record<keyof ZeenkEvents, (p: any) => void>> = {};

  const scope = getCurrentScope()!;
  watch(state, (state) => {
    const websocket = ws.value;

    if (state === 'OPEN' && websocket) {
      for (const event of _buffer) {
        sendZeenkEvent(websocket, event);
      }

      _buffer.length = 0;

      const offs: Array<() => void> = [];
      for (const _type in _listeners) {
        const type = _type as keyof ZeenkEvents;

        const cb = _listeners[type];

        delete _listeners[type];

        if (cb) {
          offs.push(
            listen(websocket, type, cb),
          );
        }
      }

      if (offs.length > 0) {
        scope.run(() => {
          onScopeDispose(() => invokeArrayFns(offs));
        });
      }
    }
  });

  return {
    state,

    send: (type, payload) => {
      const event = makeZeenkEvent(type, payload);

      if (state.value === 'OPEN' && ws.value) {
        sendZeenkEvent(ws.value, event);
      }
      else {
        _buffer.push(event);
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

export function makeZeenkEvent<K extends keyof ZeenkEvents>(type: K, payload: ZeenkEvents[K]): Event {
  return { type, payload };
}

export function sendZeenkEvent(ws: WebSocket, event: Event) {
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
    else {
      sendError(new Error(`Invalid message format: ${parsed}`));
    }
  }
  catch {
    if (import.meta.dev) {
      console.error('Couldn\'t parse message:', message);
    }
    else {
      sendError(new Error(`Couldn't parse message: ${message}`));
    }
  }

  return event;
}
