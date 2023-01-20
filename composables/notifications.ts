export function useToaster() {
  const nuxtApp = useNuxtApp();

  return nuxtApp.$toaster;
}

export function useToast() {
  const nuxtApp = useNuxtApp();

  return nuxtApp.$createToast;
}
