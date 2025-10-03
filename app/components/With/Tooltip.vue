<script setup lang="ts">
import { WithFadeTransition } from '#components';

const props = defineProps<{
  tooltip?: string
  xOffset?: number
  yOffset?: number
}>();

defineSlots<{
  default: (props: { ref: (e: any) => void, tooltipId: string }) => any
  tooltip: () => any
}>();

const { isSmallScreen } = useDevice();

const tooltipId = useId();
const tooltipEl = useTemplateRef('tooltipEl');

const shouldShow = ref(false);
const disableAppearAnimation = ref(false);
const targetEl = shallowRef<HTMLElement>();

const timeoutToShowTooltip = parseDuration('0.75s')!;
const cleanups: Array<() => any> = [];
const handlerOptions = { passive: true };

let timeout: ReturnType<typeof setTimeout> | undefined;
watch(targetEl, (target) => {
  cleanup();

  if (!target) {
    return;
  }

  cleanups.push(
    on(target, 'mouseenter', show, handlerOptions),
    on(target, 'mouseleave', hideAndClearTimeout, handlerOptions),
  );

  if (!isSmallScreen.value) {
    cleanups.push(
      on(target, 'focus', show, handlerOptions),
      on(target, 'blur', hideAndClearTimeout, handlerOptions),
    );
  }
});

watchEffect(async () => {
  if (!shouldShow.value || !targetEl.value || !tooltipEl.value) {
    return;
  }

  const { computePosition, offset, shift } = await loadFloatingUi();

  const { x, y } = await computePosition(targetEl.value, tooltipEl.value, {
    placement: 'bottom',
    middleware: [
      offset({
        mainAxis: 4 + (props.yOffset || 0),
        crossAxis: props.xOffset || 0,
      }),
      shift({ padding: 8 }),
    ],
  });

  tooltipEl.value.style.left = `${x}px`;
  tooltipEl.value.style.top = `${y}px`;
}, { flush: 'post' });

function setRef(e: HTMLElement) {
  targetEl.value = e;
}

declare global {
  interface Window {
    lastTooltipHide?: number
  }
}

function show() {
  const shouldShowTooltipImmidiatelly = Date.now() - (window.lastTooltipHide || 0) < 200;

  if (disableAppearAnimation.value !== shouldShowTooltipImmidiatelly) {
    disableAppearAnimation.value = shouldShowTooltipImmidiatelly;
  }

  if (shouldShowTooltipImmidiatelly) {
    shouldShow.value = true;
    return;
  }

  clearTimeout(timeout);
  timeout = setTimeout(() => shouldShow.value = true, timeoutToShowTooltip);
}

function hideAndClearTimeout() {
  if (shouldShow.value) {
    window.lastTooltipHide = Date.now();
  }

  clearTimeout(timeout);
  shouldShow.value = false;
}

function cleanup() {
  invokeArrayFns(cleanups);
  cleanups.length = 0;
};

onBeforeUnmount(() => {
  cleanup();
  targetEl.value = undefined;
});
</script>

<template>
  <slot :ref="setRef" :tooltip-id="tooltipId" />

  <Teleport to="#teleports">
    <WithFadeTransition :css="!disableAppearAnimation">
      <div
        v-if="shouldShow"
        :id="tooltipId"
        ref="tooltipEl"
        role="tooltip"
        inert
        class="tooltip"
        :class="{ 'with-padding': !!tooltip }"
      >
        <slot name="tooltip">
          {{ tooltip }}
        </slot>
      </div>
    </WithFadeTransition>
  </Teleport>
</template>

<style lang="scss">
.tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;

  font-size: 87.5%;
  color: hsla(var(--text-color-hsl), 0.75);

  width: max-content;

  background-color: hsla(var(--surface-color-hsl), 0.125);
  backdrop-filter: blur(12px);
  border-radius: 0.125rem;
  box-shadow:
    1px 1.7px 1.7px rgba(0, 0, 0, 0.028),
    3.4px 5.6px 5.6px rgba(0, 0, 0, 0.042),
    15px 25px 25px rgba(0, 0, 0, 0.07)
  ;

  transition: opacity 0.3s * 2 ease, transform 0.3s * 2;

  &.with-padding {
    padding: 0.125rem 0.5rem;

    border: 1px solid hsla(var(--text-color-hsl), 0.125);
  }

  &.fade-enter-from {
    transform-origin: top center;
    transform: scale(0.95);
  }
}
</style>
