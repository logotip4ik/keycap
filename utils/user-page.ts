import { del, get, set, values } from 'idb-keyval';

import type { LRUCache } from 'lru-cache';
import type * as Comlink from 'comlink';

import { blankNoteName } from '~/assets/constants';

export function preloadDashboardComponents() {
  const user = useUser();

  prefetchComponents('WorkspaceSearch');

  const blankNotePath = `/@${user.value!.username}/${blankNoteName}`;
  preloadRouteComponents(blankNotePath);
}

export async function defineFuzzyWorker() {
  // @ts-expect-error idk how to setup this
  const { wrap } = await import('comlink?only=wrap') as typeof Comlink;

  const fuzzyWorker = useFuzzyWorker();

  // https://vitejs.dev/guide/features.html#web-workers
  const worker = new Worker(new URL('../workers/fuzzy.ts', import.meta.url));

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

export function updateServiceWorker() {
  const { $pwa: pwa } = useNuxtApp();
  const createToast = useToast();

  const stopOfflineReady = watch(() => pwa.offlineReady, (ready) => {
    if (ready) {
      createToast('Phewww, now you can work offline');
      stopOfflineReady();
    }
  }, { immediate: true });

  watch(() => pwa.needRefresh, (needRefresh) => {
    if (needRefresh)
      createToast('You know that we have new content for you ?');
  }, { immediate: true });
}
