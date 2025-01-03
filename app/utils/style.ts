export function getElementWidth(el: Element | undefined | null): number {
  if (!el) {
    return 0;
  }

  return Number(
    getComputedStyle(el).width.slice(0, -2), // slicing `px`
  );
}

export function stopAnimations(el: HTMLElement) {
  const animations = el.getAnimations();
  for (const animation of animations) {
    animation.cancel();
  }
}
