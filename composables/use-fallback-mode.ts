const isOnline = useOnline();

const fallbackMode = ref(isOnline);

watch(isOnline, (value) => fallbackMode.value = value);

export default function useFallbackMode() {
  return fallbackMode;
}
