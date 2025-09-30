export function withCachedComponent<T>(loader: () => Promise<{ default: T }>) {
  let cache: T | Promise<T> | undefined;

  return (cb: (comp: T) => void) => {
    if (cache instanceof Promise) {
      cache.then(cb);
      return;
    }
    else if (!cache) {
      cache = loader().then((mod) => {
        cb(mod.default);
        cache = mod.default;
        return mod.default;
      });
      return;
    }

    cb(cache);
  };
}
