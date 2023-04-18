<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';

const toasts = useToasts();

const toasterEl = ref<null | ComponentPublicInstance<HTMLElement>>(null);

const sortedToasts = computed(() =>
  toasts.value.sort((a, b) => a.priority - b.priority),
);

let toasterElClientRect: DOMRect | null;
const ANIMATION_DURATION = 300;
function beforeLeaveHook(el: Element) {
  const elClientRect = el.getBoundingClientRect();

  toasterElClientRect = toasterElClientRect || toasterEl.value!.$el.getBoundingClientRect();

  const relativeBottomPos = (toasterElClientRect!.bottom - elClientRect.bottom);

  (el as HTMLElement).style.setProperty('--prev-bottom', `${relativeBottomPos}px`);
  (el as HTMLElement).style.setProperty('--prev-width', `${(el as HTMLElement).offsetWidth}px`);
}

function handleResize() {
  toasterElClientRect = null;
}

onMounted(() => window.addEventListener('resize', handleResize, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('resize', handleResize));
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      ref="toasterEl"
      class="toasts"
      tag="section"
      name="toast"
      @before-leave="beforeLeaveHook"
    >
      <template v-for="toast in sortedToasts" :key="toast.id">
        <WorkspaceToastsItem :toast="toast" :animation-duration="ANIMATION_DURATION" />
      </template>
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
  transform-origin: right center;

  transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s;

  @media screen and (max-width: $breakpoint-tablet) {
    transform-origin: left center;
  }

  [data-icon] {
    transition: opacity 0.4s;
  }
}

.toast-move {
  transition-duration: 0.3s;
}

.toast-enter-from {
  transform: scale(0.925) translate(0px, 7px) rotate(0deg);
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

  width: var(--prev-width);

  transition: opacity .3s;

  @media screen and (max-width: $breakpoint-tablet) {
    right: unset;
    left: 0;
  }
}
</style>
