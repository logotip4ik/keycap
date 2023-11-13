import type { Serialize } from 'nitropack';
import type { Folder, Note } from '@prisma/client';
import type { Remote } from 'comlink';

import type { SearchActionValues } from '~/types/common';

interface _IFuzzyWorker {
  searchWithQuery: (query: string, maxLength = 4) => Array<FuzzyItem>
  addItemToCache: (item: FuzzyItem) => void
  addItemsToCache: (items: Array<FuzzyItem>) => void
  refreshItemsCache: () => Promise<void>
}

declare global {
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & unknown;

  export interface ItemMetatags {
    editing?: boolean
    creating?: boolean
  };

  export type NoteMinimal = Prettify<Serialize<Pick<Note, 'id' | 'name' | 'path'> & ItemMetatags>>;
  export type NoteWithContent = Prettify<NoteMinimal & Pick<Note, 'content'>>;

  export type FolderMinimal = Prettify<Serialize<Pick<Folder, 'id' | 'name' | 'path' | 'root'> & ItemMetatags>>;
  export type FolderWithContents = Prettify<FolderMinimal & {
    notes: Array<NoteMinimal>
    subfolders: Array<FolderMinimal>
  }>;

  export type FolderOrNote = Prettify<FolderMinimal & NoteMinimal>;

  export interface CommandItem {
    name: string
    key: SearchActionValues
  }

  export type FuzzyItem = Prettify<Pick<FolderOrNote, 'name' | 'path' | 'root'>>;

  export type IFuzzyWorker = Remote<_IFuzzyWorker>;

  export interface OfflineStorage {
    setItem: <T = any>(key: string, value: T) => Promise<void>
    getItem: <T = any>(key: string) => Promise<T | undefined>
    removeItem: (key: string) => Promise<void>
    getAllItems: <T = any>() => Promise<Array<T>>
  }
}

export {};
