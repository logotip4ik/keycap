const TABBABLE_ELs = 'input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],button:not([disabled]),[tabindex="0"],audio[controls],video[controls],[contenteditable]:not([contenteditable="false"])';

export function useFocusTrap(
  el: MaybeRef<HTMLElement | null | undefined>,
  opts?: {
    handleInitialFocusing?: boolean
    handleLastElementFocus?: ((lastElement: HTMLElement) => boolean | void) | false
  },
) {
  if (import.meta.server) {
    return;
  }

  const { isSmallScreen } = useDevice();

  let lastFocusedEl: HTMLElement | undefined;
  let off: (() => void) | undefined;
  let observer: MutationObserver | undefined;
  let cachedEls: Array<HTMLElement> = [];
  let scheduled: boolean = true;

  function tryFocusLastElement() {
    if (
      !isSmallScreen.value
      && opts?.handleLastElementFocus !== false
      && lastFocusedEl
    ) {
      const handledLastElementFocus = opts?.handleLastElementFocus?.(lastFocusedEl) === true;

      if (!handledLastElementFocus) {
        lastFocusedEl.focus();
      }
    }

    lastFocusedEl = undefined;
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

  const stopWatch = watch(() => unref(el), async (el) => {
    stop();

    if (!el) {
      return tryFocusLastElement();
    }

    await nextTick();
    await nextTick();

    if (document.activeElement) {
      lastFocusedEl = document.activeElement as HTMLElement;
    }

    if (opts?.handleInitialFocusing) {
      getFocusableEls(el)[0].focus();
    }

    observer = new MutationObserver(
      debounce(() => {
        scheduled = true;
      }, 100),
    );

    observer.observe(el, {
      childList: true,
    });

    off = on(el, 'keydown', (e) => {
      if (e.key !== 'Tab') {
        return;
      }

      const focusableEls = getFocusableEls(el);
      const firstFocusedEl = focusableEls.at(0);
      const lastFocusedEl = focusableEls.at(-1);

      if (e.shiftKey && e.target === firstFocusedEl) {
        lastFocusedEl?.focus();
        e.preventDefault();
      }
      else if (!e.shiftKey && e.target === lastFocusedEl) {
        firstFocusedEl?.focus();
        e.preventDefault();
      }
    });
  });

  function stop() {
    stopWatch();
    off?.();
    observer?.disconnect();

    off = undefined;
    observer = undefined;
    cachedEls.length = 0;
    scheduled = true;
  }

  onScopeDispose(() => {
    tryFocusLastElement();
    stop();
  });

  return stop;
}

function isElementHidden(node: HTMLElement) {
  return node.offsetParent === null || getComputedStyle(node).visibility === 'hidden';
}
