const TABBABLE_ELs = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex="0"], audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])';

export interface FocusTrapOptions {
  isEnabled?: boolean | (() => boolean)
}

export function useFocusTrap(el: MaybeRef<HTMLElement | null | undefined>, opts: FocusTrapOptions = {}) {
  if (import.meta.server)
    return;

  const { isEnabled } = opts;

  const normalizedIsEnabled = typeof isEnabled === 'boolean'
    ? () => isEnabled
    : typeof isEnabled === 'function'
      ? isEnabled
      : () => true;

  let lastFocusedEl: HTMLElement | undefined;
  let off: (() => any) | undefined;
  let observer: MutationObserver | undefined;
  let cachedEls: Array<HTMLElement> = [];
  let scheduled: boolean;

  function stop() {
    off && off();
    observer && observer.disconnect();
    lastFocusedEl && lastFocusedEl.focus();
  }

  function getFocusableEls(el: HTMLElement) {
    if (scheduled) {
      scheduled = false;
      cachedEls = Array.from(el.querySelectorAll(TABBABLE_ELs)) as Array<HTMLElement>;
    }

    return cachedEls;
  }

  watch(() => unref(el), (el) => {
    stop();

    if (!el)
      return;

    if (document.activeElement)
      lastFocusedEl = document.activeElement as HTMLElement;

    let firstTime = true;
    observer = new MutationObserver(
      debounce(() => {
        scheduled = true;

        if (firstTime && normalizedIsEnabled()) {
          firstTime = false;
          const focusableEls = getFocusableEls(el);
          focusableEls[0]?.focus();
        }
      }, 100),
    );
    observer.observe(el, {
      attributes: true,
      subtree: true,
    });

    off = on(el, 'keydown', (e) => {
      if (e.key === 'Tab' && normalizedIsEnabled()) {
        const focusableEls = getFocusableEls(el);

        const currentFocuseElIdx = document.activeElement ? focusableEls.indexOf(document.activeElement as HTMLElement) : -1;

        const nextDiff = e.shiftKey ? -1 : 1;
        const nextIdx = (currentFocuseElIdx + nextDiff + focusableEls.length) % focusableEls.length;

        focusableEls[nextIdx]?.focus();

        e.preventDefault();
      }
    });
  });

  onScopeDispose(stop);

  return stop;
}
