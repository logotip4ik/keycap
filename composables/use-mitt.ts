import type { Emitter } from 'mitt';
import mitt from 'mitt';

import proxy from 'unenv/runtime/mock/proxy';

// eslint-disable-next-line ts/consistent-type-definitions
type Events = {
  'save:note'?: Partial<{ force: boolean }>
  'details:show'?: Partial<object>
  'search:show'?: Partial<object>
};

const emitter = import.meta.server ? proxy : /* #__PURE__ */ mitt<Events>();

if (import.meta.client) {
  const beseOn = emitter.on;
  // @ts-expect-error end user will still get type support because of useMitt function
  emitter.on = (type, handler) => {
    beseOn(type, handler);

    onScopeDispose(() => emitter.off(type, handler));
  };
}

export function useMitt(): Emitter<Events> {
  return emitter;
};
