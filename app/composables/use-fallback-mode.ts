import proxy from 'unenv/runtime/mock/proxy';

const fallbackMode: Ref<boolean | undefined> = import.meta.server ? proxy : ref();

export function useFallbackMode() {
  if (import.meta.server) {
    return ref(false);
  }

  if (fallbackMode.value === undefined) {
    fallbackMode.value = false;

    on(window, 'online', () => {
      fallbackMode.value = false;
    });
    on(window, 'offline', () => {
      fallbackMode.value = true;
    });

    if (!navigator.onLine) {
      nextTick(() => {
        fallbackMode.value = true;
      });
    }
  }

  return fallbackMode as Ref<boolean>;
}
