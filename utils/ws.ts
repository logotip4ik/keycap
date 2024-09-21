import type { ShallowReactive } from 'vue';
import proxy from 'unenv/runtime/mock/proxy';

let context: ShallowReactive<{
  ws: WebSocket | undefined
  state: number
}>;

// TODO: add reconnect functionality ?
export function getZeenkWs() {
  if (import.meta.server) {
    return proxy as {
      ws: ComputedRef<WebSocket | undefined>
      state: ComputedRef<number>
    };
  }

  if (!context) {
    context = shallowReactive({
      ws: undefined,
      state: 0,
    });
  }

  const { zeenkUrl } = useRuntimeConfig().public;
  const proto = import.meta.prod ? 'wss://' : 'ws://';

  useNuxtApp().runWithContext(() => {
    watch(() => context.ws, (ws, _, onCleanup) => {
      if (!ws) {
        ws = new WebSocket(proto + zeenkUrl);

        const offs = [
          on(ws, 'open', () => {
            context.state = WebSocket.OPEN;
          }, { once: true }),

          on(ws, 'close', () => {
            context.state = WebSocket.CLOSED;
          }, { once: true }),
        ];

        context.ws = ws;

        onCleanup(() => invokeArrayFns(offs));
      }
    }, { flush: 'sync', immediate: true });
  });

  return {
    ws: computed(() => context.ws),
    state: computed(() => context.state),
  };
}
