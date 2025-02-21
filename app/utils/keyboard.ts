/** only call this function in setup context */
export function useModKey() {
  const { isMac } = useDevice();

  return computed(() => isMac.value ? 'Cmd' : 'Ctrl');
}
