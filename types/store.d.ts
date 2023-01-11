import type { Note, Folder } from '@prisma/client'
import type { Remote } from 'comlink'

import type { SearchAction } from '~/types/common'

interface _IFuzzyWorker {
  searchWithQuery: (query: string, maxLength = 4) => FuzzyItem[]
  addItemToCache: (item: FuzzyItem) => void
  addItemsToCache: (items: FuzzyItem[]) => void
}

declare global {
  type NoteMinimal = Pick<Note, 'id' | 'name'> & {
    path?: string
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
    key: SearchAction
  }

  type FuzzyItem = Pick<FolderOrNote, 'name' | 'path' | 'root'>;

  interface IFuzzyWorker extends Remote<_IFuzzyWorker> {
  }
}

export {}
