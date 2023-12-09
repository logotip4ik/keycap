// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line no-sequences
onmessage = ({ data: b }) => (Atomics.wait(b, 0), postMessage(0));
