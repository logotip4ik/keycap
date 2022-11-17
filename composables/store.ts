import type { Folder, Note } from '@prisma/client';

export type NoteMinimal = Pick<Note, 'id' | 'name'> & {
  path?: string
  content?: string
  editing?: boolean
  creating?: boolean
  updatedAt?: Date
  createdAt?: Date
};

export interface FolderWithContents extends Folder {
  notes: NoteMinimal[]
  subfolders: FolderWithContents[]
}

export type FolderOrNote = FolderWithContents & NoteMinimal;

export type Updatable<T> = {
  -readonly [Property in keyof T]?: T[Property]
};

export const useRootFolderContents = () => useState<FolderWithContents | null>(() => null);

const notesCache = new Map();
export const useNotesCache = () => notesCache;

// TODO: support deletion from nested folders
export function deleteNoteFromFolder(noteToDelete: NoteMinimal) {
  const rootFolder = useRootFolderContents();

  if (!rootFolder.value) return;

  const noteIdxToDelete = rootFolder.value.notes.findIndex((note) => note.id === noteToDelete.id);

  if (noteIdxToDelete === -1) return;

  rootFolder.value.notes.splice(noteIdxToDelete, 1);
}

export function updateNoteInFolder(noteToUpdate: NoteMinimal, fieldsToUpdate: Updatable<NoteMinimal>) {
  const rootFolder = useRootFolderContents();

  if (!rootFolder.value) return;

  const noteIdxToUpdate = rootFolder.value.notes.findIndex((note) => note.id === noteToUpdate.id);

  rootFolder.value.notes[noteIdxToUpdate] = {
    ...rootFolder.value.notes[noteIdxToUpdate],
    ...fieldsToUpdate,
  };
}
