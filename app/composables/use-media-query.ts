export function useMediaQuery(query: MaybeRef<string>) {
  if (import.meta.server) {
    return ref(false);
  }

  const value = ref(false);

  watch(() => unref(query), (query, _, onCleanup) => {
    const media = window.matchMedia(query);

    onCleanup(
      on(media, 'change', (e) => value.value = e.matches),
    );

    value.value = media.matches;
  }, { immediate: true });

  return value;
}
