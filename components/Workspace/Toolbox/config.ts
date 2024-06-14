// @unimport-disable
export const ToolboxState = Symbol(
  import.meta.prod ? '' : 'toolbox sidebar state and helper functions',
) as InjectionKey<{
  state: Ref<SidebarState>
}>;

// This is better version of general purpose useToolboxSidbar, you should use this everywhere you
// possible can. Of course there is limitation by root sidebar provide, but for such cases you still
// can use useToolboxSidbar
export function useToolboxState() {
  if (import.meta.prod) {
    return inject(ToolboxState)!;
  }

  const injection = inject(ToolboxState);

  if (!injection) {
    throw new Error('injection for ToolboxState is not found');
  }

  return injection;
}
