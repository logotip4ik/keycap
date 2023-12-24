const isFallbackMode = ref(false);

export function useFallbackMode() {
  return isFallbackMode;
}

if (import.meta.client) {
  if (navigator)
    isFallbackMode.value = !navigator.onLine;

  if (import.meta.dev) {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => isFallbackMode.value = false);
      window.addEventListener('offline', () => isFallbackMode.value = true);
    }
  }
  else {
    window.addEventListener('online', () => isFallbackMode.value = false);
    window.addEventListener('offline', () => isFallbackMode.value = true);
  }
}
