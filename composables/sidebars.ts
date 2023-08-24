import { getCookie } from 'h3';

export type SidebarState = 'hidden' | 'visible' | 'pinned';

export function makeSidebarState(key: string): Ref<SidebarState> {
  return useState<SidebarState>(key, () => { // TODO: maybe default to hidden on phones ?
    const stateWhitelist = ['hidden', 'visible', 'pinned'] satisfies Array<SidebarState>;
    let stateCookieValue: SidebarState | undefined;

    if (import.meta.env.SSR) {
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
