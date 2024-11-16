import type { KeyBindingMap, KeyBindingOptions } from 'tinykeys';

import { createKeybindingsHandler } from 'tinykeys';

export function useTinykeys(shortcuts: KeyBindingMap, options?: KeyBindingOptions) {
  if (import.meta.server) {
    return;
  }

  // TODO: this will be broken if we change target
  onBeforeUnmount(
    on(window, 'keydown', createKeybindingsHandler(shortcuts, options)),
  );
};
