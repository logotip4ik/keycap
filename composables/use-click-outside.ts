import type { Ref } from 'vue';

export default (target: Ref<HTMLElement | null>, callback: (e: Event) => any) => {
  const register = (event: string, action: (e: any) => any, opts: object) => {
    window.addEventListener(event, action, opts);
    return () => window.removeEventListener(event, action, opts);
  };

  const listener = (event: PointerEvent) => {
    if (!target.value?.contains(event.target as HTMLElement))
      callback(event);
  };

  const cleanups: Function[] = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };

  const stopWatch = watch(target, (target) => {
    cleanup();

    if (!target)
      return;

    cleanups.push(
      register('click', listener, { passive: true, capture: true }),
    );
  }, { immediate: true, flush: 'post' });

  const stop = () => {
    stopWatch();
    cleanup();
  };

  onScopeDispose(stop);

  return stop;
};
