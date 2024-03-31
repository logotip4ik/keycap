import { getCookie } from 'h3';
import type { MaybeRef } from 'vue';

export type SidebarState = 'hidden' | 'visible' | 'pinned';

export function shouldUnpinSidebar<T extends MaybeRef<SidebarState>>(first: T, second: T): T | undefined {
  if (
    window.innerWidth < sidebarsBreakpoints.two
    && unref(first) === 'pinned'
    && unref(second) === 'pinned'
  ) {
    return second;
  }

  if (
    window.innerWidth < sidebarsBreakpoints.one
    && unref(second) === 'pinned'
  ) {
    return second;
  }
}

/**
 * @description Takes into consideration window width. If there is enough room
 *   for two it will return `visible`, so the sidebar will not use the note space, but
 *   still remain opened before mouse leaves the element
 */
export function unpinSidebar(state: MaybeRef<SidebarState>): SidebarState {
  return unref(state) === 'pinned'
    ? window.innerWidth >= sidebarsBreakpoints.one
      ? 'visible'
      : 'hidden'
    : 'pinned';
}

export function useToolboxSidebar() {
  return {
    visibility: makeSidebarVisibility('toolbox'),
  };
}

export function useContentsSidebar() {
  return {
    visibility: makeSidebarVisibility('contents'),
  };
}

const stateWhitelist = ['hidden', 'visible', 'pinned'] satisfies Array<SidebarState>;
export function makeSidebarVisibility(key: string): Ref<SidebarState> {
  return useState<SidebarState>(key, () => {
    let stateCookieValue: SidebarState | undefined;

    if (import.meta.server) {
      const event = useRequestEvent()!;

      stateCookieValue = getCookie(event, key) as SidebarState;
    }
    else {
      stateCookieValue = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(key))
        ?.split('=')[1] as SidebarState | undefined;
    }

    if (stateCookieValue && stateWhitelist.includes(stateCookieValue)) {
      return stateCookieValue as SidebarState || 'hidden';
    }

    return 'hidden';
  });
}
