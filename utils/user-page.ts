import { del, get, set, values } from 'idb-keyval';

import type LRUCache from '@tinkoff/lru-cache-nano';
import type * as Comlink from 'comlink';

export function preloadDashboardComponents() {
  const user = useUser();

  prefetchComponents('WorkspaceSearch');

  const blankNotePath = `/@${user.value!.username}/${BLANK_NOTE_NAME}`;
  preloadRouteComponents(blankNotePath);
}

export async function defineFuzzyWorker() {
  // @ts-expect-error idk how to setup this
  const { wrap } = await import('comlink?only=wrap') as typeof Comlink;

  const fuzzyWorker = useFuzzyWorker();

  // https://vitejs.dev/guide/features.html#web-workers
  const worker = isProduction
    ? new Worker(new URL('../workers/fuzzy.ts', import.meta.url))
    : new Worker(new URL('../workers/fuzzy.ts', import.meta.url), { type: 'module' });

  fuzzyWorker.value = wrap(worker);
}

export function getOfflineStorage() {
  const createToast = useToast();
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

    const items = await values<FolderOrNote>() || [];

    for (const item of items) {
      const isFolder = 'root' in item;
      const cache = (isFolder ? foldersCache : notesCache) as LRUCache<string, FolderOrNote>;

      if (!cache.has(item.path))
        cache.set(item.path, item);
    }

    mitt.emit('cache:populated');
  }, { immediate: true });

  return offlineStorage;
}
