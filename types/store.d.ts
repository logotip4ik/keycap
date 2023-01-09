import type { Note, Folder } from '@prisma/client'

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
  action: (args: string[] | null) => any
}
