import LRUCache from 'hashlru';

import type { Remote } from 'comlink';

import { del, get, keys, set } from 'idb-keyval';
import type { SafeUser } from '~/types/server';

export const useCurrentItemForDetails = () => useState<FolderOrNote | null>(() => null);
export const useUser = () => useState<SafeUser | undefined>('user', () => undefined);

const notesCache = LRUCache(20);
export const useNotesCache = () => notesCache;

const foldersCache = LRUCache(5);
export const useFoldersCache = () => foldersCache;

const fuzzyWorker = shallowRef<Prettify<Remote<FuzzyWorker>> | undefined>();
export const useFuzzyWorker = () => fuzzyWorker;

const offlineStorage = shallowReactive<OfflineStorage>(import.meta.client
  ? {
      setItem: set,
      getItem: get,
      removeItem: del,
      getAllKeys: keys,
    }
  : {
      setItem: () => devError('setItem should not be used on the server'),
      getItem: () => devError('getItem should not be used on the server'),
      removeItem: () => devError('removeItem should not be used on the server'),
      getAllKeys: () => devError('getAllKeys should not be used on the server'),
    } as OfflineStorage,
);
export const useOfflineStorage = () => offlineStorage;
