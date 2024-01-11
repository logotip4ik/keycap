import type { Serialize } from 'nitropack';
import type { Folder, Note, Prisma } from '@prisma/client';

import type { SearchActionValues } from '~/types/common';

declare global {
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & unknown;

  export interface ItemMetatags {
    editing?: boolean
    creating?: boolean
  };

  export type ItemMetadata = Prettify<
    Pick<Note, 'updatedAt' | 'createdAt'> // | Pick<Folder, 'updatedAt' | 'createdAt'> - folder metadata should be the same as notes
  >;

  export type NoteShare = Prisma.NoteGetPayload<{ select: { shares: { select: { link: true, updatedAt: true, createdAt: true } } } }>;
  export type NoteMinimal = Prettify<Serialize<Pick<Note, 'id' | 'name' | 'path'> & ItemMetatags>>;
  export type NoteWithContent = Prettify<NoteMinimal & Pick<Note, 'content'>>;

  export type FolderMinimal = Prettify<Serialize<Pick<Folder, 'id' | 'name' | 'path' | 'root'> & ItemMetatags>>;
  export interface FolderContents {
    notes: Array<NoteMinimal>
    subfolders: Array<FolderMinimal>
  };
  export type FolderWithContents = Prettify<FolderMinimal & FolderContents>;

  export type FolderOrNote = Prettify<FolderMinimal & NoteMinimal>;

  export type SharedNote = Pick<Note, 'name' | 'content' | 'updatedAt' | 'createdAt'>;

  export interface CommandItem {
    name: string
    key: SearchActionValues
  }

  export type FuzzyItem = Prettify<Pick<FolderOrNote, 'name' | 'path'> & { root?: boolean }>;

  export interface FuzzyWorker {
    searchWithQuery: (query: string, maxLength = 4) => Array<FuzzyItem | CommandItem>
    addItemToCache: (item: FuzzyItem) => void
    addItemsToCache: (items: Array<FuzzyItem>) => void
    refreshItemsCache: () => Promise<void>
  }

  export interface OfflineStorage {
    setItem: <T = unknown>(key: string, value: T) => Promise<void>
    getItem: <T = unknown>(key: string) => Promise<T | undefined>
    removeItem: (key: string) => Promise<void>
    getAllItems: <T = unknown>() => Promise<Array<T>>
  }
}

export { };
