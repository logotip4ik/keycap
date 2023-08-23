<script setup lang="ts">
import { getCookie } from 'h3';
import { debounce } from 'perfect-debounce';
import parseDuration from 'parse-duration';

export type SidebarState = 'hidden' | 'visible' | 'pinned';
export type State = Ref<SidebarState>;

interface Props {
  cookieName: string
  dir?: 'left' | 'right'
}
const props = withDefaults(defineProps<Props>(), { dir: 'left' });

const state: State = useState<SidebarState>(props.cookieName, () => { // TODO: maybe default to hidden on phones ?
  const stateWhitelist = ['hidden', 'visible', 'pinned'] satisfies Array<SidebarState>;
  let stateCookieValue: SidebarState | undefined;

  if (import.meta.env.SSR) {
    const event = useRequestEvent();

    stateCookieValue = getCookie(event, props.cookieName) as SidebarState;
  }
  else {
    stateCookieValue = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(props.cookieName))
      ?.split('=')[1] as SidebarState | undefined;
  }

  if (stateCookieValue && stateWhitelist.includes(stateCookieValue))
    return stateCookieValue as SidebarState || 'hidden';

  return 'hidden';
});

function updateState(newState: SidebarState) {
  state.value = newState;
}

provide('sidebar-state', state);

watch(state, debounce((state: SidebarState) => {
  const value: SidebarState = state === 'visible' ? 'hidden' : state;

  document.cookie = `${props.cookieName}=${value}; Max-Age=${parseDuration('0.5year', 's')}; Path=/; Secure; SameSite=Lax`;
}, 350));
</script>

<template>
  <div
    class="sidebar-spacer"
    :class="{ 'sidebar-spacer--open': state === 'pinned' }"
  />

  <aside
    class="sidebar"
    :class="{ 'sidebar--hidden': state === 'hidden', 'sidebar--right': dir === 'right' }"
    :data-state="state"
    @pointerleave="state === 'visible' && updateState('hidden')"
  >
    <slot :state="state" :update-state="updateState" />
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
  --dir: 1;
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

  &--right {
    --dir: -1;
    left: inherit;
    right: var(--mr-x);

    transform-origin: right top;
  }

  &--hidden {
    transform: scale(var(--sidebar-hidden-scale)) translateX(calc(-1 * var(--dir) * var(--sidebar-width)));
  }
}
</style>
