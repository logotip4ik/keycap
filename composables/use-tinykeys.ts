import { tinykeys } from 'tinykeys';

import type { KeyBindingMap, KeyBindingOptions } from 'tinykeys';

export function useTinykeys(shortcuts: KeyBindingMap, options?: KeyBindingOptions) {
  if (import.meta.server) {
    return;
  }

  // TODO: this will be broken if we change target
  onBeforeUnmount(tinykeys(window, shortcuts, options));
};
