/** only call this function in setup context */
export function useModKey() {
  const { isMac } = useDevice();

  return isMac.value ? 'Cmd' : 'Ctrl';
}
