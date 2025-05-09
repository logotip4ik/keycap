import type { Selectable } from 'kysely';
import type { Serialize } from 'nitropack';

import type { Folder as _Folder, Note as _Note, Share as _Share } from '~~/kysely/db/types';

import type { ItemStateValues, SearchActionValues } from './common';

type Note = Selectable<_Note>;
type Folder = Selectable<_Folder>;
type Share = Selectable<_Share>;

declare global {
  type Prettify<T> = Omit<T, never>;

  export interface ItemMetatags {
    state?: ItemStateValues
  };

  // - folder metadata should be the same as notes
  export type ItemMetadata = Prettify<Pick<Note, 'updatedAt' | 'createdAt'>>;

  export type NoteMinimal = Prettify<Serialize<Pick<Note, 'id' | 'name' | 'path'> & ItemMetatags>>;
  export type NoteWithContent = Prettify<NoteMinimal & Pick<Note, 'content'>>;

  export type FolderMinimal = Prettify<Serialize<Pick<Folder, 'id' | 'name' | 'path' | 'root'> & ItemMetatags>>;
  export interface FolderContents {
    notes: Array<NoteMinimal>
    subfolders: Array<FolderMinimal>
  };
  export type FolderWithContents = Prettify<FolderMinimal & FolderContents>;

  export type SharedNote = Pick<Note, 'name' | 'content' | 'updatedAt' | 'createdAt'>;

  export interface CommandItem {
    name: string
    key: SearchActionValues
  }

  export interface FuzzyItem {
    name: string
    path: string
    root?: boolean
  }
}

export { };
