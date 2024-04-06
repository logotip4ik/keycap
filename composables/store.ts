import LRUCache from 'hashlru';

import type { Remote } from 'comlink';

import type { SafeUser } from '~/types/server';

export const useCurrentItemForDetails = () => useState<FolderOrNote | null>(() => null);
export const useUser = () => useState<SafeUser | undefined>('user', () => undefined);

const notesCache = LRUCache(20);
export const useNotesCache = () => notesCache;

const foldersCache = LRUCache(5);
export const useFoldersCache = () => foldersCache;

const fuzzyWorker = shallowRef<null | Prettify<Remote<FuzzyWorker>>>(null);
export const useFuzzyWorker = () => fuzzyWorker;

const offlineStorage = shallowReactive<Partial<OfflineStorage>>(import.meta.server ? {} : getOfflineStorage());
export const useOfflineStorage = () => offlineStorage;
