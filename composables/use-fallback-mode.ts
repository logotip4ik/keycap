import proxy from 'unenv/runtime/mock/proxy';

const fallbackMode: Ref<boolean | undefined> = import.meta.server ? proxy : ref();

export function useFallbackMode() {
  if (import.meta.server) {
    return ref(false);
  }

  if (!fallbackMode.value) {
    fallbackMode.value = !window.navigator.onLine;

    on(window, 'online', () => {
      fallbackMode.value = false;
    });
    on(window, 'offline', () => {
      fallbackMode.value = true;
    });
  }

  return fallbackMode as Ref<boolean>;
}
