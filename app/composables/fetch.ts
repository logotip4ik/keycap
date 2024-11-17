export function useKFetch(nuxtApp = useNuxtApp()) {
  return nuxtApp.$kfetch;
}
