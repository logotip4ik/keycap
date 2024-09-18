import proxy from 'unenv/runtime/mock/proxy';

interface Event {
  type: keyof ZeenkEvents
  payload?: unknown
}

interface ZeenkEvents {
  'update-note': { path: string, steps: Array<unknown> }
};

interface Zeenk {
  /**
   * @description compare with WebSocket.OPEN or WebSocket.CLOSED etc.
   */
  state: Ref<number>

  send: <T extends keyof ZeenkEvents>(type: T, payload: ZeenkEvents[T]) => void
  on: <T extends keyof ZeenkEvents>(type: T, cb: (payload: ZeenkEvents[T]) => void) => void
}

export function useZeenk(): Zeenk {
  if (import.meta.server) {
    return proxy as Zeenk;
  }

  const { state, ws } = getZeenkWs();

  const listeners: Partial<Record<keyof ZeenkEvents, Array<(payload: ZeenkEvents[keyof ZeenkEvents]) => void>>> = {};
  const _buffer: Array<Event> = [];

  const off = on(ws, 'open', () => {
    if (_buffer.length > 0) {
      for (const e of _buffer) {
        ws.send(JSON.stringify(e));
      }

      _buffer.length = 0;
    }
  }, { once: true });

  onScopeDispose(() => {
    off();

    for (const cbs of Object.values(listeners)) {
      cbs.length = 0;
    }
  });

  return {
    state,

    send: (type, payload) => {
      const event = { type, payload } satisfies Event;

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event));
      }
      else {
        _buffer.push(event);
      }
    },

    on: (type, cb) => {
      const off = on(ws, 'message', (ev) => {
        const event = parseMessage(ev.data);

        if (event && event.type === type) {
          cb(event.payload as ZeenkEvents[keyof ZeenkEvents]);
        }
      });

      onScopeDispose(off);

      return off;
    },
  };
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
