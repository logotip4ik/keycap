import type { Ref } from 'vue';

export function useClickOutside(target: Ref<HTMLElement | null>, callback: (e: Event) => any) {
  const listener = (event: MouseEvent) => {
    if (!target.value?.contains(event.target as HTMLElement))
      callback(event);
  };

  const cleanups: Array<() => any> = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };

  const stopWatch = watch(target, (target) => {
    cleanup();

    if (!target)
      return;

    cleanups.push(
      on(window, 'click', listener, { passive: true, capture: true }),
      on(window, 'contextmenu', listener, { passive: true, capture: true }),
    );
  }, { immediate: true, flush: 'post' });

  const stop = () => {
    stopWatch();
    cleanup();
  };

  onScopeDispose(stop);

  return stop;
};
