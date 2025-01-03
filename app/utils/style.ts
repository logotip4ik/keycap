export function getElementWidth(el: Element | undefined | null): number {
  if (!el) {
    return 0;
  }

  return Number(
    getComputedStyle(el).width.slice(0, -2), // slicing `px`
  );
}

export function stopAnimations(el: HTMLElement) {
  // getAnimations is not available in happy-dom
  const animations = el.getAnimations?.();
  if (animations) {
    for (const animation of animations) {
      animation.cancel();
    }
  }
}
