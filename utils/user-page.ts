import { del, get, set, values } from 'idb-keyval';

export function preloadDashboardComponents() {
  prefetchComponents('WorkspaceSearch');

  const blankNotePath = `/@a/${BLANK_NOTE_NAME}`;
  preloadRouteComponents(blankNotePath);
}

export async function defineFuzzyWorker() {
  const coincident = await import('coincident').then((m) => m.default);

  const fuzzyWorker = useFuzzyWorker();

  // https://vitejs.dev/guide/features.html#web-workers
  const worker = import.meta.prod
    ? new Worker(new URL('../workers/fuzzy.ts', import.meta.url))
    : new Worker(new URL('../workers/fuzzy.ts', import.meta.url), { type: 'module' });

  fuzzyWorker.value = coincident(worker) as FuzzyWorker;
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

// if (import.meta.hot) {
//   import.meta.hot.accept(() => {
//     defineFuzzyWorker();
//   });
// }
