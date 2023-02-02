import type { Note, Folder } from '@prisma/client'
import type { Remote } from 'comlink'

import type { SearchAction, SearchActionValues } from '~/types/common'

interface _IFuzzyWorker {
  searchWithQuery: (query: string, maxLength = 4) => FuzzyItem[]
  addItemToCache: (item: FuzzyItem) => void
  addItemsToCache: (items: FuzzyItem[]) => void
  refreshItemsCache: () => Promise<void>
}

declare global {
  type NoteMinimal = Pick<Note, 'id' | 'name' | 'path'> & {
    content?: string
    editing?: boolean
    creating?: boolean
    updatedAt?: Date
    createdAt?: Date
  };

  interface FolderWithContents extends Folder {
    editing?: boolean
    creating?: boolean
    notes: NoteMinimal[]
    subfolders: FolderWithContents[]
  }

  type FolderOrNote = FolderWithContents & NoteMinimal;

  interface CommandItem {
    name: string
    key: SearchActionValues
  }

  type FuzzyItem = Pick<FolderOrNote, 'name' | 'path' | 'root'>;

  interface IFuzzyWorker extends Remote<_IFuzzyWorker> {
  }

  interface OfflineStorage {
    setItem: <T = any>(key: string, value: T) => Promise<void>
    getItem: <T = any>(key: string) => Promise<T | undefined>
    removeItem: (key: string) => Promise<void>
    getAllItems: <T = any>() => Promise<T[]>
  }
}

export {}
