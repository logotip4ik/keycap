<script setup lang="ts">
import parseDuration from 'parse-duration';

defineProps<{ tooltip?: string }>();

const shouldShow = ref(false);
const target = shallowRef<HTMLElement | null>(null);
const tooltipEl = shallowRef<HTMLElement | null>(null);
const tooltipId = (Math.random() * 1_000_000).toFixed(0);

const timeoutToShowTooltip = parseDuration('0.75s')!;
const cleanups: Array<() => any> = [];
const handlerOptions = { passive: true };

let timeout: NodeJS.Timeout | undefined;
watch(target, (target) => {
  cleanup();

  if (!target)
    return;

  cleanups.push(
    on(target, 'mouseenter', showWithTimeout, handlerOptions),
    on(target, 'focus', showWithTimeout, handlerOptions),

    on(target, 'mouseleave', hideAndClearTimeout, handlerOptions),
    on(target, 'blur', hideAndClearTimeout, handlerOptions),
  );
});

watch(shouldShow, async (shouldShow) => {
  if (!shouldShow || !target.value || !tooltipEl.value)
    return;

  const { computePosition, shift, offset } = await import('@floating-ui/dom');
  const { x, y } = await computePosition(target.value, tooltipEl.value, {
    placement: 'bottom',
    middleware: [
      offset(4),
      shift({ padding: 8 }),
    ],
  });

  Object.assign(tooltipEl.value.style, {
    top: `${y}px`,
    left: `${x}px`,
  });
});

function showWithTimeout() {
  timeout = setTimeout(() => shouldShow.value = true, timeoutToShowTooltip);
}

function hideAndClearTimeout() {
  clearTimeout(timeout);
  shouldShow.value = false;
}

function cleanup() {
  invokeArrayFns(cleanups);
  cleanups.length = 0;
};

onMounted(() => {
  const instance = getCurrentInstance();

  if (!instance)
    return;

  target.value = (instance.vnode.el as HTMLElement).nextElementSibling as HTMLElement | null;
});

onBeforeUnmount(cleanup);
</script>

<template>
  <slot :tooltip-id="tooltipId" />

  <WithFadeTransition>
    <div
      v-show="shouldShow"
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

  &.with-padding {
    padding: 0.125rem 0.5rem;

    border: 1px solid hsla(var(--text-color-hsl), 0.125);
  }
}
</style>