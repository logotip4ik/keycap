/* @__NO_SIDE_EFFECTS__ */
export function on(target: any, event: string, handler: (...args: any[]) => any, opts?: any) {
  target.addEventListener(event, handler, opts);
  return () => target.removeEventListener(event, handler, opts);
}
