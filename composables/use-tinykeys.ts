import { tinykeys } from 'tinykeys';

import type { KeyBindingMap, KeyBindingOptions } from 'tinykeys';

export function useTinykeys(shortcuts: KeyBindingMap, options: KeyBindingOptions = {}) {
  if (import.meta.server)
    return;

  onMounted(() => {
    const unregisterTinykeys = tinykeys(window, shortcuts, options);

    onBeforeUnmount(() => unregisterTinykeys());
  });
};
