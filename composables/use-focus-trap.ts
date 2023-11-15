const TABBABLE_ELs = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex="0"], audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])';

export function useFocusTrap(el: MaybeRef<HTMLElement | null | undefined>) {
  if (import.meta.server) return;

  let lastFocusedEl: HTMLElement | undefined;
  let off: (() => any) | undefined;
  let observer: MutationObserver | undefined;
  let focusableEls: Array<HTMLElement> = [];

  function stop() {
    off && off();
    observer && observer.disconnect();

    lastFocusedEl?.focus();
  }

  function getFocusableEls(el: HTMLElement) {
    return Array.from(el.querySelectorAll(TABBABLE_ELs)) as Array<HTMLElement>;
  }

  watch(() => unref(el), (el) => {
    stop();

    if (!el)
      return;

    if (document.activeElement)
      lastFocusedEl = document.activeElement as HTMLElement;

    let firstTime = true;
    observer = new MutationObserver(() => {
      focusableEls = getFocusableEls(el);

      if (firstTime) {
        firstTime = false;
        focusableEls[0]?.focus();
      }
    });
    observer.observe(el, {
      attributes: true,
      subtree: true,
    });

    off = on(el, 'keydown', (e) => {
      if (e.key === 'Tab') {
        const currentFocuseElIdx = document.activeElement ? focusableEls.indexOf(document.activeElement as HTMLElement) : -1;
        const nextIdx = (currentFocuseElIdx + 1) % focusableEls.length;

        focusableEls[nextIdx]?.focus();

        e.preventDefault();
      }
    });
  });

  onScopeDispose(stop);

  return stop;
}
