const isOnline = useOnline();

const fallbackMode = ref(!isOnline);

watch(isOnline, (value) => fallbackMode.value = !value);

export function useFallbackMode() {
  return fallbackMode;
}
