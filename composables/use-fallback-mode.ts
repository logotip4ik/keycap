const isFallbackMode = ref(false);

export function useFallbackMode() {
  return isFallbackMode;
}

if (import.meta.client) {
  if (navigator)
    isFallbackMode.value = !navigator.onLine;

  window.addEventListener('online', () => isFallbackMode.value = false);
  window.addEventListener('offline', () => isFallbackMode.value = true);
}
