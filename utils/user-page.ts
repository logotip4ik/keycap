import { del, get, set, values } from 'idb-keyval';
import { wrap as comlink } from 'comlink';

import type { Remote } from 'comlink';

export function preloadDashboardComponents() {
  prefetchComponents('WorkspaceSearch');

  const blankNotePath = `/@a/${BLANK_NOTE_NAME}`;
  preloadRouteComponents(blankNotePath);
}

export async function defineFuzzyWorker() {
  const coincident = await import('coincident').then((m) => m.default);

  const fuzzyWorker = useFuzzyWorker();

  const fallbackWorker = new Worker(new URL('../workers/async-coincidence-fallback.ts', import.meta.url));
  const fallbackValueObject = { value: null as null | Promise<void> };
  const fallbackAsyncWait = (buffer: any) => {
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
  const foldersCache = useFoldersCache();
  const notesCache = useNotesCache();
  const mitt = useMitt();

  const offlineStorage = {
    setItem: set,
    getItem: get,
    removeItem: del,
    getAllItems: values,
  };

  let fallbackToast: ReturnType<typeof createToast>;

  watch(isFallbackMode, async (value) => {
    if (!value) return;

    if (!fallbackToast)
      fallbackToast = createToast('Fallback mode enabled. Populating cache from offline storage.');

    const items = (await values<FolderOrNote>() || [])
      .filter((value) => typeof value === 'object');

    for (const item of items) {
      const isFolder = 'root' in item;
      const cache = isFolder ? foldersCache : notesCache;

      if (!cache.has(item.path))
        cache.set(item.path, item);
    }

    mitt.emit('cache:populated');
  }, { immediate: true });

  return offlineStorage;
}
