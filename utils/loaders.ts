import proxy from 'unenv/runtime/mock/proxy';

let floatingUi: {
  computePosition: typeof import('@floating-ui/dom').computePosition
  offset: typeof import('@floating-ui/dom').offset
  shift: typeof import('@floating-ui/dom').shift
  flip: typeof import('@floating-ui/dom').flip
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
