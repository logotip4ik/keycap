import type { KeyBindingMap, KeyBindingOptions } from 'tinykeys';

import { tinykeys } from 'tinykeys';

export function useTinykeys(shortcuts: KeyBindingMap, options?: KeyBindingOptions) {
  if (import.meta.server) {
    return;
  }

  // TODO: this will be broken if we change target
  onBeforeUnmount(tinykeys(window, shortcuts, options));
};
