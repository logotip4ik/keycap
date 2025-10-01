export function getContainerDimensionsTransition(
  container_: MaybeRef<HTMLElement | undefined>,
  opts?: { heightAnimateProperty?: 'height' | 'minHeight' },
) {
  let prevHeight: number | undefined;

  const heightAnimateProperty = opts?.heightAnimateProperty || 'height';

  return {
    rememberSize: () => {
      const container = toValue(container_);
      if (!container) {
        return;
      }

      prevHeight = getElementHeight(container);
    },

    animateSize: () => {
      const container = toValue(container_);

      if (!container || prevHeight === undefined) {
        return;
      }

      stopAnimations(container);

      const currentHeight = getElementHeight(container);

      if (currentHeight === undefined) {
        return;
      }

      container.animate([
        { [heightAnimateProperty]: `${prevHeight.toFixed(2)}px` },
        { [heightAnimateProperty]: `${currentHeight.toFixed(2)}px` },
      ], { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    },
  };
}
