<script setup lang="ts">
import { getCookie } from 'h3';
import { debounce } from 'perfect-debounce';
import parseDuration from 'parse-duration';

export type SidebarState = 'hidden' | 'visible' | 'pinned';

const stateCookieName = '_sidebar-state';
const state = useState<SidebarState>(() => { // TODO: maybe default to hidden on phones ?
  const stateWhitelist = ['hidden', 'visible', 'pinned'] satisfies Array<SidebarState>;
  let stateCookieValue: SidebarState | undefined;

  if (import.meta.env.SSR) {
    const event = useRequestEvent();

    stateCookieValue = getCookie(event, stateCookieName) as SidebarState;
  }
  else {
    stateCookieValue = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(stateCookieName))
      ?.split('=')[1] as SidebarState | undefined;
  }

  if (stateCookieValue && stateWhitelist.includes(stateCookieValue))
    return stateCookieValue as SidebarState || 'hidden';

  return 'hidden';
});

function updateState(newState: SidebarState) {
  state.value = newState;
}

watch(state, debounce((state: SidebarState) => {
  const value: SidebarState = state === 'visible' ? 'hidden' : state;

  document.cookie = `${stateCookieName}=${value}; Max-Age=${parseDuration('0.5year', 's')}; Path=/; Secure; SameSite=Lax`;
}, 350));
</script>

<template>
  <div
    class="sidebar-spacer"
    :class="{ 'sidebar-spacer--open': state === 'pinned' }"
  />

  <aside
    id="sidebar"
    class="sidebar"
    :class="{ 'sidebar--hidden': state === 'hidden' }"
    :data-state="state"
    @pointerleave="state === 'visible' && updateState('hidden')"
  >
    <!-- TODO: add fade ? animation when entering. Something like iphone quick settings menu -->
    <!-- TODO: use provide instead of props ? -->
    <WorkspaceSidebarHeader
      :state="state"
      @update-state="updateState"
    />

    <WorkspaceSidebarFooter />
  </aside>
</template>

<style lang="scss">
:root {
  --ease: cubic-bezier(0.16, 1, 0.3, 1); // expo
  --sidebar-width: min(33.3vw, 25rem);
  --sidebar-tr-duration: .375s;

  @media (width <= $breakpoint-tablet) {
    --sidebar-width: 100vw;
  }
}

.sidebar-spacer {
  width: 0;
  height: 100%;

  will-change: width;
  transition: width var(--sidebar-tr-duration) var(--ease);

  @media (width > $breakpoint-tablet) {
    &--open {
      width: var(--sidebar-width);
    }
  }
}

.sidebar {
  --base-shadow-color: 0, 0, 0;
  --sidebar-hidden-scale: 0.975;

  --mr-y: 2rem;
  --mr-x: 1rem;
  --pd-x: 1rem;
  --pd-y: 1rem;

  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;

  position: absolute;
  top: var(--mr-y);
  left: var(--mr-x);
  z-index: 1;

  width: calc(var(--sidebar-width) - var(--mr-x));
  height: calc(100% - var(--mr-y) * 2);

  padding: var(--pd-y) var(--pd-x);

  border: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);
  border-radius: 0.35rem;
  background-color: hsla(var(--surface-color-hsl), 0.975);
  box-shadow:
    0px 0px 5.3px -20px rgba(var(--base-shadow-color), 0.02),
    0px 0px 17.9px -20px rgba(var(--base-shadow-color), 0.03),
    0px 0px 80px -20px rgba(var(--base-shadow-color), 0.05)
  ;

  transform-origin: left top;
  transition: transform var(--sidebar-tr-duration) var(--ease);

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
  }

  @media (width <= $breakpoint-tablet) {
    --mr-y: 1rem;
    --mr-x: 0.5rem;

    width: calc(var(--sidebar-width) - var(--mr-x) * 2);
  }

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.25);

    backdrop-filter: blur(12px);
  }

  &--hidden {
    transform: scale(var(--sidebar-hidden-scale)) translateX(calc(-1 * var(--sidebar-width)));
  }
}
</style>
