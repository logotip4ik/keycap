<script setup lang="ts">
import parseDuration from 'parse-duration';

import type { SidebarState } from '~/composables/sidebars';

type FocusableElement = HTMLAnchorElement | HTMLButtonElement;

interface Props {
  dir?: 'left' | 'right'
  name: string
  state: Ref<SidebarState>
  onUpdateState: (newState: SidebarState) => any
}
const props = withDefaults(defineProps<Props>(), { dir: 'left' });

const sidebar = shallowRef<HTMLDivElement | null>(null);
const focusableElements = shallowRef<Array<FocusableElement>>([]);
const state = toRef(props, 'state');

defineExpose({ el: sidebar });

function updateFocusableElements() {
  if (!sidebar.value)
    return;

  const elements = Array.from(sidebar.value.querySelectorAll<FocusableElement>('a, button'));

  focusableElements.value = elements;
}

function updateTabindexForFocusableElements(currentState: SidebarState) {
  for (const el of focusableElements.value) {
    if (typeof el.dataset.openButton !== 'undefined')
      continue;

    if (currentState === 'hidden')
      el.setAttribute('tabindex', '-1');
    else
      el.removeAttribute('tabindex');
  }
}

async function trapFocusInsideSidebar(event: Event) {
  if (sidebar.value) {
    const trapFocus = (await import('focus-trap-js')).default;

    trapFocus(event, sidebar.value);
  }
}

function hideIf(trigger: SidebarState) {
  if (state.value === trigger)
    props.onUpdateState('hidden');
}

let off: (() => any) | undefined;
watch(state, debounce((state: SidebarState) => {
  off && off();

  updateTabindexForFocusableElements(state);

  const cookieValue: SidebarState = state === 'visible' ? 'hidden' : state;
  document.cookie = `${props.name}=${cookieValue}; Max-Age=${parseDuration('0.5year', 's')}; Path=/; Secure; SameSite=Lax`;

  if (state === 'visible')
    off = on(sidebar.value!, 'keydown', trapFocusInsideSidebar);
}, 375), { flush: 'post' });

watch(focusableElements, debounce(() => {
  updateTabindexForFocusableElements(state.value);
}, 375), { flush: 'post' });

useClickOutside(sidebar, () => hideIf('visible'));

useTinykeys({
  Escape: () => hideIf('visible'),
});

onMounted(() => {
  requestIdleCallback(updateFocusableElements);

  const observer = new MutationObserver(debounce(updateFocusableElements, 100));

  observer.observe(sidebar.value!, { childList: true, subtree: true });

  onBeforeUnmount(() => {
    observer.disconnect();
    off && off();
  });
});
</script>

<template>
  <div
    class="sidebar-spacer"
    :class="{ 'sidebar-spacer--open': state === 'pinned' }"
  />

  <aside
    v-bind="$attrs"
    ref="sidebar"
    class="sidebar"
    :class="{ 'sidebar--hidden': state === 'hidden', 'sidebar--right': dir === 'right' }"
    :tabindex="state === 'hidden' ? undefined : 0"
    @pointerleave="state === 'visible' && onUpdateState('hidden')"
  >
    <slot />
  </aside>
</template>

<style lang="scss">
$breakpoint-one: $sidebar-breakpoint-one;

:root {
  --sidebar-width: min(33.3vw, 26rem);
  --sidebar-tr-duration: .375s;
  --sidebar-tr-ease: cubic-bezier(0.16, 1, 0.3, 1); // expo

  @media (width <= $breakpoint-one) {
    --sidebar-width: 100vw;
  }
}

.sidebar-spacer {
  width: 0;
  height: 100%;

  will-change: width;
  transition: width var(--sidebar-tr-duration) var(--sidebar-tr-ease);

  @media (width > $breakpoint-one) {
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

  position: fixed;
  top: var(--mr-y);
  left: var(--mr-x);
  z-index: 1;

  width: calc(var(--sidebar-width) - var(--mr-x) * 2);
  height: calc(100% - var(--mr-y) * 2);

  padding: var(--pd-y) var(--pd-x);

  border: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);
  border-radius: 0.35rem;
  background-color: transparent;
  box-shadow:
    0px 0px 5.3px -20px rgba(var(--base-shadow-color), 0.02),
    0px 0px 17.9px -20px rgba(var(--base-shadow-color), 0.03),
    0px 0px 80px -20px rgba(var(--base-shadow-color), 0.05)
  ;

  will-change: transform;
  transform-origin: left top;
  transition: transform var(--sidebar-tr-duration) var(--sidebar-tr-ease);

  &::before {
    content: '';

    position: absolute;
    inset: 0;

    border-radius: inherit;
    background-color: hsla(var(--surface-color-hsl), 0.975);

    @supports (backdrop-filter: blur(1px)) {
      background-color: hsla(var(--surface-color-hsl), 0.25);

      backdrop-filter: blur(16px);
    }
  }

  & > * {
    isolation: isolate;
  }

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
  }

  @media (width <= $breakpoint-one) {
    --mr-y: 1rem;
    --mr-x: 0.75rem;

    width: calc(var(--sidebar-width) - var(--mr-x) * 2);
  }

  &:focus-visible {
    outline: 2px solid hsla(var(--selection-bg-color-hsl), 0.75);
    box-shadow: 0 0 0.75rem hsla(var(--selection-bg-color-hsl), 0.5);
  }

  &--right {
    --dir: -1;
    left: inherit;
    right: var(--mr-x);

    transform-origin: right top;
  }

  &--hidden {
    transform: scale3d(var(--sidebar-hidden-scale), var(--sidebar-hidden-scale), 1) translate3d(calc(-1 * var(--dir) * var(--sidebar-width)), 0, 0);
  }

  hr {
    width: 97.5%;
    height: 1px;

    margin-block: calc(var(--pd-y) / 2);

    border: none;
    background-image: linear-gradient(to right,
      hsla(var(--selection-bg-color-hsl), 0.15) 0%,
      hsla(var(--selection-bg-color-hsl), 0.35) 50%,
      hsla(var(--selection-bg-color-hsl), 0.15) 100%,
    )
  }
}

@media print {
  .sidebar, .sidebar-spacer {
    display: none;
  }
}
</style>
