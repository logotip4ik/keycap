import { del, get, set, values } from 'idb-keyval';
import { wrap as comlink } from 'comlink';

import type { Remote } from 'comlink';

export function preloadDashboardComponents() {
  const blankNotePath = `/@a/${BLANK_NOTE_NAME}`;
  preloadRouteComponents(blankNotePath);
}

export async function defineFuzzyWorker() {
  const coincident = await import('coincident').then((m) => m.default);

  const fuzzyWorker = useFuzzyWorker();

  const fallbackWorker = new Worker(new URL('../workers/async-coincidence-fallback.ts', import.meta.url));
  const fallbackValueObject = { value: null as null | Promise<void> };
  const fallbackAsyncWait = <T>(buffer: T) => {
    fallbackValueObject.value = new Promise((onmessage) => {
      fallbackWorker.onmessage = () => onmessage();
      fallbackWorker.postMessage(buffer);
    });

    return fallbackValueObject;
  };

  // https://vitejs.dev/guide/features.html#web-workers
  const worker = import.meta.prod
    ? new Worker(new URL('../workers/fuzzy.ts', import.meta.url))
    : new Worker(new URL('../workers/fuzzy.ts', import.meta.url), { type: 'module' });

  // Worker is broken in dev because it relies on SharedArrayBuffer, which is only available for
  // cross origin isolated sites, which localhost is not. But even if i set appropriate headers
  // for isolation, then workers will not be available on localhost
  if (import.meta.prod) {
    fuzzyWorker.value = coincident(worker, {
      // @ts-expect-error patched version without types
      fallbackAsyncWait,
    }) as Remote<FuzzyWorker>;
  }
  else {
    fuzzyWorker.value = comlink(worker);
  }
}

export function getOfflineStorage() {
  const createToast = useToaster();
  const isFallbackMode = useFallbackMode();

  const offlineStorage = {
    setItem: set,
    getItem: get,
    removeItem: del,
    getAllItems: values,
  };

  let fallbackToast: ReturnType<typeof createToast>;

  watch(isFallbackMode, async (value) => {
    if (!value) {
      fallbackToast?.remove();
      return;
    }

    if (!fallbackToast)
      fallbackToast = createToast('Fallback mode enabled. Populating cache from offline storage.');

    // We previously were populating user cache from offline storage
    // but, now folder or note will try fetching it's contents from
    // cache then from offline storage, so there is no need to do
    // population ahead of time
  }, { immediate: true });

  return offlineStorage;
}
