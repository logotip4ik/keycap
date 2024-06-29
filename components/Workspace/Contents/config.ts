// @unimport-disable
export const ContentsState = Symbol(
  import.meta.prod ? '' : 'toolbox sidebar state and helper functions',
) as InjectionKey<{
  state: Ref<SidebarState>
  isFixed: Ref<boolean>
}>;

// This is better version of general purpose useContentsSidebar, you should use this everywhere you
// possible can. Of course there is limitation by root sidebar provide, but for such cases you still
// can use useContentsSidebar
export function useContentsState() {
  if (import.meta.prod) {
    return inject(ContentsState)!;
  }

  const injection = inject(ContentsState);

  if (!injection) {
    throw new Error('injection for ContentsState is not found');
  }

  return injection;
}
