<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';

const toasts = useToasts();

const toasterEl = ref<null | ComponentPublicInstance<HTMLElement>>(null);
const toasterElClientRect = useElementBounding(toasterEl, { windowScroll: false });

const sortedToasts = computed(() =>
  toasts.value.sort((a, b) => a.priority - b.priority),
);

const ANIMATION_DURATION = 300;
function beforeLeaveHook(el: Element) {
  const elClientRect = el.getBoundingClientRect();

  const relativeBottomPos = (toasterElClientRect.bottom.value - elClientRect.bottom);

  (el as HTMLElement).style.setProperty('--prev-bottom', `${relativeBottomPos}px`);
  (el as HTMLElement).style.setProperty('--prev-width', `${elClientRect.width}px`);
}
</script>

<template>
  <TransitionGroup
    ref="toasterEl"
    class="notifications"
    tag="section"
    name="toast"
    @before-leave="beforeLeaveHook"
  >
    <template v-for="toast in sortedToasts" :key="toast.id">
      <WorkspaceToastsItem :toast="toast" :animation-duration="ANIMATION_DURATION" />
    </template>
  </TransitionGroup>
</template>

<style lang="scss">
.notifications {
  display: grid;
  justify-items: flex-end;
  justify-content: flex-end;
  gap: max(1vh, 0.25rem);

  position: fixed;
  bottom: 3rem;
  right: max(3vw, 1rem);
  z-index: 1;

  pointer-events: none;

  @media screen and (max-width: $breakpoint-tablet) {
    justify-items: flex-start;
    justify-content: flex-start;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast-enter-active [data-icon] {
  transition: opacity 0.4s ease;
}

.toast-move {
  transition-duration: 0.3s;
}

.toast-enter-from,
.toast-enter-from [data-icon],
.toast-leave-to {
  opacity: 0;
}

.toast-leave-active {
  position: absolute;
  bottom: var(--prev-bottom);
  right: 0;

  width: var(--prev-width);
}
</style>
