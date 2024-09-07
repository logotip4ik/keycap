import type { Emoji } from '@emoji-mart/data';
import type { Selectable } from 'kysely';
import type { Serialize } from 'nitropack';
import type { Folder as _Folder, Note as _Note, Share as _Share } from '~/kysely/db/types';

import type { ItemStateValues, SearchActionValues } from '~/types/common';

type Note = Selectable<_Note>;
type Folder = Selectable<_Folder>;
type Share = Selectable<_Share>;

declare global {
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & unknown;

  export interface ItemMetatags {
    state?: ItemStateValues
  };

  export type ItemMetadata = Prettify<
    Pick<Note, 'updatedAt' | 'createdAt'> // | Pick<Folder, 'updatedAt' | 'createdAt'> - folder metadata should be the same as notes
  >;

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
    searchWithQuery: (query: string) => Array<FuzzyItem | CommandItem>
    searchForEmoji: (query: string) => Promise<Array<Emoji>>
    addItemToCache: (item: FuzzyItem) => void
    refreshItemsCache: () => Promise<void>
  }

  export interface OfflineStorage {
    setItem: <T = unknown>(key: string, value: T) => Promise<void>
    getItem: <T = unknown>(key: string) => Promise<T | undefined>
    removeItem: (key: string) => Promise<void>
    getAllKeys: () => Promise<Array<string>>
  }
}

export { };
