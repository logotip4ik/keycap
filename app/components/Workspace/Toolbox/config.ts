import invariant from 'tiny-invariant';

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

  invariant(injection, 'Injection for ToolboxState isn\'t found');

  return injection;
}

export function usePinToolbox() {
  const { state } = useToolboxState();

  return () => {
    if (state.value === 'pinned') {
      return;
    }

    state.value = 'pinned';
  };
}
