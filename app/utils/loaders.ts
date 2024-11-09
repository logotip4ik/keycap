import type { computePosition, flip, offset, shift } from '@floating-ui/dom';

import proxy from 'unenv/runtime/mock/proxy';

let floatingUi: {
  computePosition: typeof computePosition
  offset: typeof offset
  shift: typeof shift
  flip: typeof flip
} | undefined;

export async function loadFloatingUi() {
  if (import.meta.server) {
    return proxy as NonNullable<typeof floatingUi>;
  }

  if (!floatingUi) {
    const { computePosition, flip, offset, shift } = await import('@floating-ui/dom');

    floatingUi = {
      computePosition,
      flip,
      offset,
      shift,
    };
  }

  return floatingUi;
}
