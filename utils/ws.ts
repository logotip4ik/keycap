import proxy from 'unenv/runtime/mock/proxy';

let ws: WebSocket | undefined;
let state: Ref<number> | undefined;

// TODO: add reconnect functionality ?
export function getZeenkWs() {
  if (import.meta.server) {
    return {
      ws: proxy as NonNullable<typeof ws>,
      state: proxy as NonNullable<typeof state>,
    };
  }

  if (!ws) {
    const { zeenkUrl } = useRuntimeConfig().public;
    const proto = import.meta.prod ? 'wss://' : 'ws://';

    ws = new WebSocket(proto + zeenkUrl);
  }

  if (!state) {
    state = ref(ws.readyState);

    on(ws, 'open', () => state!.value = WebSocket.OPEN, { once: true });
    on(ws, 'close', () => state!.value = WebSocket.CLOSED, { once: true });
  }

  return { ws, state };
}
