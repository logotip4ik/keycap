import type { Note, Folder } from '@prisma/client'
import type { Remote } from 'comlink'

import type { SearchAction } from '~/types/common'

declare type NoteMinimal = Pick<Note, 'id' | 'name'> & {
  path?: string
  content?: string
  editing?: boolean
  creating?: boolean
  updatedAt?: Date
  createdAt?: Date
};

declare interface FolderWithContents extends Folder {
  editing?: boolean
  creating?: boolean
  notes: NoteMinimal[]
  subfolders: FolderWithContents[]
}

declare type FolderOrNote = FolderWithContents & NoteMinimal;

declare interface CommandItem {
  name: string
  key: SearchAction
}

declare type FuzzyItem = Pick<FolderOrNote, 'name' | 'path' | 'root'>;

interface _IFuzzyWorker {
  searchWithQuery: (query: string, maxLength = 4) => FuzzyItem[]
  addItemToCache: (item: FuzzyItem) => void
  addItemsToCache: (items: FuzzyItem[]) => void
}

declare interface IFuzzyWorker extends Remote<_IFuzzyWorker> {
}
