let modKey: 'Ctrl' | 'Cmd';
// only call this function in setup context
export function getModKey() {
  if (!modKey) {
    const { isMac } = useDevice();

    modKey = isMac.value ? 'Cmd' : 'Ctrl';
  }

  return modKey;
}
