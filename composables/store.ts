import LRUCache from 'hashlru';
import { del, get, keys, set } from 'idb-keyval';
import proxy from 'unenv/runtime/mock/proxy';

import type { Remote } from 'comlink';
import type { ShallowRef } from 'vue';

import type { SafeUser } from '~/types/server';

export function useCurrentItemForDetails() {
  return useState<FolderOrNote | undefined>(() => undefined);
}

export function useUser() {
  return useState<SafeUser | undefined>('user', () => undefined);
}

const notesCache = import.meta.server ? proxy : /* #__PURE__ */ LRUCache(20);
export function useNotesCache(): ReturnType<typeof LRUCache> {
  return notesCache;
}

const foldersCache = import.meta.server ? proxy : /* #__PURE__ */ LRUCache(10);
export function useFoldersCache(): ReturnType<typeof LRUCache> {
  return foldersCache;
}

const fuzzyWorker = import.meta.server ? proxy : /* #__PURE__ */ shallowRef<Prettify<Remote<FuzzyWorker>> | undefined>();
export function useFuzzyWorker(): ShallowRef<Prettify<Remote<FuzzyWorker>> | undefined> {
  return fuzzyWorker;
}

const offlineStorage = import.meta.server
  ? proxy
  : /* #__PURE__ */ {
      setItem: set,
      getItem: get,
      removeItem: del,
      getAllKeys: keys,
    };
export function useOfflineStorage(): OfflineStorage {
  return offlineStorage;
}
