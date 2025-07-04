<script setup lang="ts">
type FocusableElement = HTMLAnchorElement | HTMLButtonElement;

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  dir?: 'left' | 'right'
  name: string
  injectionKey: InjectionKey<{ state: Ref<SidebarState> }>
}>(), { dir: 'left' });

const sidebar = useTemplateRef('sidebar');
const focusableElements = shallowRef<Array<FocusableElement>>([]);
const { state } = inject(props.injectionKey)!;

defineExpose({ el: sidebar });

function updateFocusableElements() {
  if (!sidebar.value) {
    return;
  }

  const elements = Array.from(sidebar.value.querySelectorAll<FocusableElement>('a,button,select'));

  focusableElements.value = elements;
}

function updateTabindexForFocusableElements(currentState: SidebarState) {
  const isHidden = currentState === 'hidden';

  for (const el of focusableElements.value) {
    if (el.dataset.openButton !== undefined) {
      continue;
    }

    if (isHidden) {
      el.setAttribute('tabindex', '-1');
    }
    else {
      el.removeAttribute('tabindex');
    }
  }
}

function hideIf(trigger: SidebarState) {
  if (state.value === trigger) {
    state.value = 'hidden';
  }
}

function maybeFocusEditor(element: HTMLElement) {
  if (!element.classList.contains('tiptap')) {
    return;
  }

  withTiptapEditor((editor) => editor.commands.focus('start'));
  return true;
}

watch(state, debounce((state: SidebarState) => {
  nextTick(() => {
    updateTabindexForFocusableElements(state);
  });

  const cookieValue = state === 'visible' ? 'hidden' : state;
  setUCookie(props.name, cookieValue, {
    path: '/',
    secure: import.meta.prod,
    sameSite: 'lax',
    maxAge: parseDuration('0.5year', 's')!,
  });
}, 375));

watch(focusableElements, debounce(() => {
  nextTick(() => {
    updateTabindexForFocusableElements(state.value);
  });
}, 375));

useClickOutside(sidebar, () => hideIf('visible'));
useTinykeys({
  Escape: () => hideIf('visible'),
});
useFocusTrap(
  computed(() => state.value === 'visible' ? sidebar.value : undefined),
  { handleLastElementFocus: maybeFocusEditor },
);

onMounted(() => {
  requestIdleCallback(updateFocusableElements);

  const sidebarEl = sidebar.value;
  if (!sidebarEl) {
    return;
  }

  const observer = new MutationObserver(debounce(updateFocusableElements, 100));

  observer.observe(sidebarEl, { childList: true, subtree: true });

  onBeforeUnmount(() => {
    observer.disconnect();
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
    data-testId="sidebar"
    :class="{ 'sidebar--hidden': state === 'hidden', 'sidebar--right': dir === 'right' }"
    :tabindex="state === 'hidden' ? undefined : 0"
    @mouseleave="state === 'visible' && (state = 'hidden')"
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

  transform-origin: left top;
  transition: transform var(--sidebar-tr-duration) var(--sidebar-tr-ease);

  &::before {
    content: '';

    position: absolute;
    inset: 0;
    z-index: -1;

    border-radius: inherit;
    background-color: hsla(var(--surface-color-hsl), 0.975);

    @supports (backdrop-filter: blur(1px)) {
      background-color: hsla(var(--surface-color-hsl), 0.25);

      backdrop-filter: blur(16px);
    }
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
    box-shadow: none;

    transform:
      translate3d(
        calc(-1 * var(--dir) * var(--sidebar-width)),
        0,
        0
      )
    ;
  }

  hr {
    width: 97.5%;
    min-height: 1px;

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
