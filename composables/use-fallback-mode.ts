export function useFallbackMode() {
  if (import.meta.server) {
    return ref(false);
  }

  const fallback = ref(!window.navigator.onLine);
  const offs = [
    on(window, 'online', () => {
      fallback.value = false;
    }),
    on(window, 'offline', () => {
      fallback.value = true;
    }),
  ];

  onScopeDispose(() => {
    invokeArrayFns(offs);
    offs.length = 0;
  });

  return fallback;
}
