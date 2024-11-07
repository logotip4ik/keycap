import { clear, del, get, keys, set } from 'idb-keyval';

import proxy from 'unenv/runtime/mock/proxy';

export const offlineStoragePrefixes = {
  Settings: 'stg',
  Item: 'itm',
} as const;

export type OfflineStoragePrefixes = typeof offlineStoragePrefixes;

export interface OfflineStorage {
  getVersion: () => Promise<number | undefined>
  setVersion: (v: number) => Promise<void>

  clear: () => Promise<void>

  getItem: (key: string) => Promise<FolderMinimal | NoteMinimal | undefined>
  setItem: (key: string, value: FolderMinimal | NoteMinimal) => Promise<void>
  removeItem: (key: string) => Promise<void>
  getItemsKeys: () => Promise<Array<string>>
}

let offlineStorage: OfflineStorage;

export function getOfflineStorage() {
  if (import.meta.server) {
    return proxy as OfflineStorage;
  }

  if (!offlineStorage) {
    offlineStorage = {
      getVersion: () => get(`${offlineStoragePrefixes.Settings}:version`),
      setVersion: (v) => set(`${offlineStoragePrefixes.Settings}:version`, v),

      clear: () => clear(),

      getItem: (key) => get(`${offlineStoragePrefixes.Item}:${key}`),
      setItem: (key, value) => set(`${offlineStoragePrefixes.Item}:${key}`, value),
      removeItem: (key) => del(`${offlineStoragePrefixes.Item}:${key}`),
      getItemsKeys: async () => {
        const values = await keys();

        const itemKeys: Array<string> = [];

        for (const key of values) {
          if (typeof key === 'string' && key.startsWith(offlineStoragePrefixes.Item)) {
            itemKeys.push(key.substring(offlineStoragePrefixes.Item.length + 1));
          }
        }

        return itemKeys;
      },
    };
  }

  return offlineStorage;
}
