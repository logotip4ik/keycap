let fallbackMode: Ref<boolean> | undefined;

export function useFallbackMode() {
  if (import.meta.server) {
    return ref(false);
  }

  if (!fallbackMode) {
    fallbackMode = ref(false);

    mountListeners(fallbackMode);
  }

  return fallbackMode;
}

function mountListeners(fallback: Ref<boolean>) {
  on(window, 'online', () => fallback.value = true);
  on(window, 'offline', () => fallback.value = true);
}
