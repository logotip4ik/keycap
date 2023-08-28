import { getCookie } from 'h3';

export type SidebarState = 'hidden' | 'visible' | 'pinned';
export const sidebarVisibleStates = ['visible', 'pinned'] satisfies Array<SidebarState>;

/* @__NO_SIDE_EFFECTS__ */ export function shouldUnpinSidebar(first: ReturnType<typeof makeSidebarState>, second: ReturnType<typeof makeSidebarState>) {
  if (window.innerWidth < sidebarsBreakpoints.two && first.value === 'pinned' && second.value === 'pinned')
    return second;

  if (window.innerWidth < sidebarsBreakpoints.one && second.value === 'pinned')
    return second;
}

export function useToolboxSidebarState() {
  return makeSidebarState('toolbox');
}

export function useContentsSidebarState() {
  return makeSidebarState('contents');
}

export function makeSidebarState(key: string): Ref<SidebarState> {
  return useState<SidebarState>(key, () => { // TODO: maybe default to hidden on phones ?
    const stateWhitelist = ['hidden', 'visible', 'pinned'] satisfies Array<SidebarState>;
    let stateCookieValue: SidebarState | undefined;

    if (import.meta.server) {
      const event = useRequestEvent();

      stateCookieValue = getCookie(event, key) as SidebarState;
    }
    else {
      stateCookieValue = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(key))
        ?.split('=')[1] as SidebarState | undefined;
    }

    if (stateCookieValue && stateWhitelist.includes(stateCookieValue))
      return stateCookieValue as SidebarState || 'hidden';

    return 'hidden';
  });
}
