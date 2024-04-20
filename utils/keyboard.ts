let modKey: 'Ctrl' | 'Cmd';
export function getModKey() {
  if (!modKey) {
    const { isMac } = useDevice();

    modKey = isMac.value ? 'Cmd' : 'Ctrl';
  }

  return modKey;
}
