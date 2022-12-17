import tinykeys from 'tinykeys';

import type { KeyBindingMap } from 'tinykeys';

export default (shortcuts: KeyBindingMap) => {
  onMounted(() => {
    const unregisterTinykeys = tinykeys(window, shortcuts);

    onBeforeUnmount(() => unregisterTinykeys());
  });
};
