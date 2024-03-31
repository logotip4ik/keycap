export function useClickOutside(target: Ref<HTMLElement | null | undefined>, callback: (e: Event) => void) {
  if (import.meta.server) {
    return;
  }

  function listener(event: MouseEvent) {
    if (!target.value?.contains(event.target as HTMLElement)) {
      callback(event);
    }
  }

  const cleanups: Array<() => void> = [];
  function cleanup() {
    invokeArrayFns(cleanups);
    cleanups.length = 0;
  }

  const stopWatch = watch(target, (target) => {
    cleanup();

    if (!target) {
      return;
    }

    cleanups.push(
      on(window, 'click', listener, { passive: true, capture: true }),
      on(window, 'contextmenu', listener, { passive: true, capture: true }),
    );
  }, { immediate: true, flush: 'post' });

  function stop() {
    stopWatch();
    cleanup();
  }

  onScopeDispose(stop);

  return stop;
};
