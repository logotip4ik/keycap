<script setup lang="ts">
const toasts = useToasts();

const toasterComp = useTemplateRef('toasterComp');

const sortedToasts = computed(() =>
  toasts.value.slice().sort((a, b) => a.priority - b.priority),
);

let toasterElClientRect: DOMRect | undefined;
const ANIMATION_DURATION = parseDuration('0.3s')!;
function preservePositionAndSize(el: Element) {
  const toasterEl = toasterComp.value?.$el as HTMLDivElement | undefined;

  if (!toasterEl) {
    return;
  }

  const elClientRect = el.getBoundingClientRect();

  if (!toasterElClientRect) {
    toasterElClientRect = toasterEl.getBoundingClientRect();
  }

  const relativeBottomPos = (toasterElClientRect.bottom - elClientRect.bottom);

  (el as HTMLElement).style.setProperty('bottom', `${relativeBottomPos}px`);
  (el as HTMLElement).style.setProperty('width', `${elClientRect.width}px`);
}

function handleResize() {
  toasterElClientRect = undefined;
}

if (import.meta.client) {
  onBeforeUnmount(
    on(window, 'resize', handleResize),
  );
}
</script>

<template>
  <Teleport to="#teleports">
    <TransitionGroup
      ref="toasterComp"
      class="toasts"
      tag="section"
      name="toast"
      aria-label="Notifications"
      @before-leave="preservePositionAndSize"
    >
      <LazyToastsItem
        v-for="toast in sortedToasts"
        :key="toast.id"
        :toast="toast"
        :animation-duration="ANIMATION_DURATION"
      />
    </TransitionGroup>
  </Teleport>
</template>

<style lang="scss">
.toasts {
  --screen-spacing-bottom: 3rem;
  --screen-spacing-x: max(3vw, 1rem);

  display: grid;
  justify-items: flex-end;
  justify-content: flex-end;
  gap: max(1vh, 0.25rem);

  position: fixed;
  bottom: max(var(--screen-spacing-bottom), env(safe-area-inset-bottom));
  right: max(var(--screen-spacing-x), env(safe-area-inset-right));
  z-index: 20;

  width: calc(
    100vw -
    max(var(--screen-spacing-x) * 2, env(safe-area-inset-left) + env(safe-area-inset-right))
  );

  pointer-events: none;

  @media (max-width: $breakpoint-tablet) {
    --screen-spacing-bottom: 1rem;

    justify-items: flex-start;
    justify-content: flex-start;

    right: unset;
    left: var(--screen-spacing-x);
  }
}

.toast-move,
.toast-enter-active {
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);

  z-index: -1;

  transform-origin: bottom center;
  transition: transform 0.3s var(--ease-out-cubic), opacity 0.3s;
}

.toast-leave-active {
  position: absolute;
  right: 0;
  z-index: -1;

  transition: transform 0.3s, opacity 0.3s;

  @media (max-width: $breakpoint-tablet) {
    right: unset;
    left: 0;
  }
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  filter: blur(3px);
  transform: scale(0.95);
}
</style>
