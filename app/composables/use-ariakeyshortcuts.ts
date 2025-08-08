export function useAriaKeyshortcuts(shortcut: string) {
  const { isMac } = useDevice();

  return computed(() => humanizeShortcut(shortcut, isMac.value ? 'Meta' : 'Control'));
}
