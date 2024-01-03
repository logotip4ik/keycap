import LRUCache from 'hashlru';

import type { Remote } from 'comlink';

export const useCurrentItemForDetails = () => useState<FolderOrNote | null>(() => null);
export const useRootFolderContents = () => useState<FolderWithContents | null>(() => null);

const notesCache = LRUCache(100);
export const useNotesCache = () => notesCache;

const foldersCache = LRUCache(25);
export const useFoldersCache = () => foldersCache;

const fuzzyWorker = shallowRef<null | Prettify<Remote<FuzzyWorker>>>(null);
export const useFuzzyWorker = () => fuzzyWorker;

const offlineStorage = shallowReactive<Partial<OfflineStorage>>(import.meta.server ? {} : getOfflineStorage());
export const useOfflineStorage = () => offlineStorage;
