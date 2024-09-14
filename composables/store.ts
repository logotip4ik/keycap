import type { Remote } from 'comlink';
import type { ShallowRef } from 'vue';

import LRUCache from 'hashlru';

import { del, get, keys, set } from 'idb-keyval';
import proxy from 'unenv/runtime/mock/proxy';

import type { SafeUser } from '~/types/server';

interface LRU<T> {
  has: (key: string | number) => boolean
  remove: (key: string | number) => void
  get: (key: string | number) => T
  set: (key: string | number, value: T) => void
  clear: () => void
}

const detailsItem = import.meta.server ? proxy : /* #__PURE__ */ shallowRef();
export function useCurrentItemForDetails(): ShallowRef<FolderMinimal | NoteMinimal | undefined> {
  if (import.meta.server) {
    return shallowRef();
  }

  return detailsItem;
}

export function useUser() {
  return useState<SafeUser | undefined>('user', () => undefined);
}

const notesCache = import.meta.server ? proxy : /* #__PURE__ */ LRUCache(20);
export function useNotesCache(): LRU<NoteWithContent> {
  return notesCache;
}

const foldersCache = import.meta.server ? proxy : /* #__PURE__ */ LRUCache(10);
export function useFoldersCache(): LRU<FolderWithContents> {
  return foldersCache;
}

const fuzzyWorker = import.meta.server ? proxy : /* #__PURE__ */ shallowRef();
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
