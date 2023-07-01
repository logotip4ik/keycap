<script setup lang="ts">
import parseDuration from 'parse-duration';
import type { ComponentPublicInstance } from 'vue';

const toasts = useToasts();

const toasterEl = ref<null | ComponentPublicInstance<HTMLElement>>(null);

const sortedToasts = computed(() =>
  toasts.value.sort((a, b) => a.priority - b.priority),
);

let toasterElClientRect: DOMRect | null;
const ANIMATION_DURATION = parseDuration('0.3s')!;
function beforeLeaveHook(el: Element) {
  const elClientRect = el.getBoundingClientRect();

  toasterElClientRect = toasterElClientRect || toasterEl.value!.$el.getBoundingClientRect();

  const relativeBottomPos = (toasterElClientRect!.bottom - elClientRect.bottom);
  const correctElWidth = Math.max((el as HTMLElement).offsetWidth, elClientRect.width);

  (el as HTMLElement).style.setProperty('--prev-bottom', `${relativeBottomPos}px`);
  (el as HTMLElement).style.setProperty('--prev-width', `${correctElWidth}px`);
}

function handleResize() {
  toasterElClientRect = null;
}

if (typeof window !== 'undefined')
  useEventListener(window, 'resize', handleResize, { passive: true });
</script>

<!-- TODO: investigate why hydration mismatch appears with TransitionGroup wrapped in Teleport -->

<template>
  <TransitionGroup
    ref="toasterEl"
    class="toasts"
    tag="section"
    name="toast"
    @before-leave="beforeLeaveHook"
  >
    <WorkspaceToastsItem
      v-for="(toast, i) in sortedToasts"
      :key="toast.id"
      :toast="toast"
      :animation-duration="ANIMATION_DURATION"
      :data-has-top-sibling="!!sortedToasts[i - 1]"
    />
  </TransitionGroup>
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
  bottom: var(--screen-spacing-bottom);
  right: var(--screen-spacing-x);
  z-index: 20;

  width: calc(100vw - var(--screen-spacing-x) * 2);

  pointer-events: none;

  @media screen and (max-width: $breakpoint-tablet) {
    --screen-spacing-bottom: 1rem;

    justify-items: flex-start;
    justify-content: flex-start;

    right: unset;
    left: var(--screen-spacing-x);
  }
}

.toast-enter-active {
  --initial-pos: 0px, -0.75rem, 0px;
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);

  z-index: -1;

  transform-origin: bottom center;

  transition: transform 0.4s var(--ease-out-cubic), opacity 0.3s;

  [data-icon] {
    transition: opacity 0.4s;
  }
}

.toast-enter-active[data-has-top-sibling="false"] {
  --initial-pos: 0px, 0px, 0px;

  transform-origin: center center;
}

.toast-move {
  transition-duration: 0.3s;
}

.toast-enter-from {
  transform: scale(0.9) translate3d(var(--initial-pos));
}

.toast-enter-from,
.toast-enter-from [data-icon],
.toast-leave-to {
  opacity: 0;
  filter: blur(2px);
}

.toast-leave-active {
  position: absolute;
  bottom: var(--prev-bottom);
  right: 0;
  z-index: -1;

  width: var(--prev-width);

  transition: opacity .3s;

  @media screen and (max-width: $breakpoint-tablet) {
    right: unset;
    left: 0;
  }
}
</style>
