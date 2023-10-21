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
  export interface ItemMetatags {
    editing?: boolean
    creating?: boolean
  };

  export type NoteMinimal = Pick<Note, 'name' | 'path'> & ItemMetatags & {
    id: string
  };

  export type FolderMinimal = Pick<Folder, 'name' | 'path' | 'root'> & ItemMetatags & {
    id: string
  };

  export type SerializedNote = NoteMinimal & { content: string };

  export type FolderWithContents = FolderMinimal & {
    notes: Array<NoteMinimal>
    subfolders: Array<FolderMinimal>
  };

  export type FolderOrNote = FolderMinimal & NoteMinimal;

  export interface CommandItem {
    name: string
    key: SearchActionValues
  }

  export type FuzzyItem = Pick<FolderOrNote, 'name' | 'path' | 'root'>;

  export type IFuzzyWorker = Remote<_IFuzzyWorker>;

  export interface OfflineStorage {
    setItem: <T = any>(key: string, value: T) => Promise<void>
    getItem: <T = any>(key: string) => Promise<T | undefined>
    removeItem: (key: string) => Promise<void>
    getAllItems: <T = any>() => Promise<Array<T>>
  }
}

export {};
