export function useIntersectionObserver(
  el: MaybeRefOrGetter<HTMLElement | undefined | null>,
  opts: {
    defaultValue?: boolean
    rootMargin?: string
    threshold?: number | Array<number>
    once?: boolean
  } = {},
) {
  const intersecting = shallowRef(opts.defaultValue ?? false);

  if (import.meta.server) {
    return { intersecting };
  }

  const {
    rootMargin = '-10% 0px -10% 0px',
    threshold = 0,
    once = false,
  } = opts;

  if (!('IntersectionObserver' in window)) {
    intersecting.value = true;
    return { intersecting };
  }

  const stopWatch = watchEffect((onCleanup) => {
    const element = toValue(el);

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(handler, { rootMargin, threshold });

    observer.observe(element);

    onCleanup(() => {
      observer.disconnect();
    });
  });

  function handler([entry]: Array<IntersectionObserverEntry>) {
    if (intersecting.value === entry.isIntersecting) {
      return;
    }

    intersecting.value = entry.isIntersecting;

    if (once) {
      stopWatch();
    }
  }

  return { intersecting };
}
