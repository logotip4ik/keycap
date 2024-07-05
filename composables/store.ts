import LRUCache from 'hashlru';
import { del, get, keys, set } from 'idb-keyval';
import proxy from 'unenv/runtime/mock/proxy';

import type { Remote } from 'comlink';

import type { SafeUser } from '~/types/server';

export function useCurrentItemForDetails() {
  return useState<FolderOrNote | undefined>(() => undefined);
}

export function useUser() {
  return useState<SafeUser | undefined>('user', () => undefined);
}

const notesCache = LRUCache(20);
export function useNotesCache(): typeof notesCache {
  if (import.meta.server) {
    return proxy;
  }

  return notesCache;
}

const foldersCache = LRUCache(5);
export function useFoldersCache(): typeof foldersCache {
  if (import.meta.server) {
    return proxy;
  }

  return foldersCache;
}

const fuzzyWorker = shallowRef<Prettify<Remote<FuzzyWorker>> | undefined>();
export function useFuzzyWorker(): typeof fuzzyWorker {
  if (import.meta.server) {
    return proxy;
  }

  return fuzzyWorker;
}

export function useOfflineStorage(): OfflineStorage {
  if (import.meta.server) {
    return proxy;
  }

  return {
    setItem: set,
    getItem: get,
    removeItem: del,
    getAllKeys: keys,
  };
}
