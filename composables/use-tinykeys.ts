import tinykeys from 'tinykeys';

import type { KeyBindingMap, KeyBindingOptions } from 'tinykeys';

export default (shortcuts: KeyBindingMap, options: KeyBindingOptions = {}) => {
  onMounted(() => {
    const unregisterTinykeys = tinykeys(window, shortcuts, options);

    onBeforeUnmount(() => unregisterTinykeys());
  });
};
