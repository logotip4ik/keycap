const TABBABLE_ELs = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex="0"], audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])';

export interface FocusTrapOptions {
  isEnabled?: boolean | (() => boolean)
}

export function useFocusTrap(el: MaybeRef<HTMLElement | null | undefined>, opts: FocusTrapOptions = {}) {
  if (import.meta.server)
    return;

  const { isEnabled } = opts;

  // NOTE: it should always be a function that returns boolean
  const normalizedIsEnabled = typeof isEnabled === 'boolean'
    ? () => isEnabled
    : typeof isEnabled === 'function'
      ? isEnabled
      : () => true;

  let lastFocusedEl: HTMLElement | undefined;
  let off: (() => any) | undefined;
  let observer: MutationObserver | undefined;
  let cachedEls: Array<HTMLElement> = [];
  let scheduled: boolean = true;

  function stop() {
    off && off();
    observer && observer.disconnect();
    lastFocusedEl && lastFocusedEl.focus();
  }

  function getFocusableEls(el: HTMLElement) {
    if (scheduled) {
      scheduled = false;
      cachedEls = Array.from(
        el.querySelectorAll(TABBABLE_ELs) as NodeListOf<HTMLElement>,
      ).filter((el) => !isElementHidden(el));
    }

    return cachedEls;
  }

  // NOTE: maybe separate first element focus into another watcher ?
  watch([() => unref(el), normalizedIsEnabled], ([el, isEnabled]) => {
    stop();

    if (!el)
      return;

    if (document.activeElement)
      lastFocusedEl = document.activeElement as HTMLElement;

    if (isEnabled) {
      const focusableEls = getFocusableEls(el);
      focusableEls[0]?.focus();
    }

    observer = new MutationObserver(
      debounce(() => {
        scheduled = true;
      }, 100),
    );
    observer.observe(el, {
      childList: true,
      subtree: true,
    });

    off = on(el, 'keydown', (e) => {
      if (e.key !== 'Tab' || !isEnabled) return;

      const focusableEls = getFocusableEls(el);
      const firstFocusableEl = focusableEls.at(0);
      const lastFocusedEl = focusableEls.at(-1);

      if (e.shiftKey && e.target === firstFocusableEl) {
        lastFocusedEl?.focus();
        e.preventDefault();
      }
      else if (!e.shiftKey && e.target === lastFocusedEl) {
        firstFocusableEl?.focus();
        e.preventDefault();
      }
    });
  }, { flush: 'post' });

  onScopeDispose(stop);

  return stop;
}

function isElementHidden(node: HTMLElement) {
  return node.offsetParent === null || getComputedStyle(node).visibility === 'hidden';
}
