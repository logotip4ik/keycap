import LRU from 'lru-cache';

import type { Note } from '@prisma/client';
import type { FolderWithContents, NoteMinimal } from '~/types/store';

export const useRootFolderContents = () => useState<FolderWithContents | null>(() => null);
export const useCurrentNoteState = () => useState<'' | 'updating' | 'fetching' | 'saved'>(() => '' as const);

const notesCache = new LRU<string, Note>({ max: 20 });
export const useNotesCache = () => notesCache;

const foldersCache = new LRU<string, FolderWithContents>({ max: 20 });
export const useFoldersCache = () => foldersCache;

export function deleteNoteFromFolder(noteToDelete: NoteMinimal, parent: FolderWithContents) {
  const noteIdxToDelete = parent.notes.findIndex((note) => note.id === noteToDelete.id);

  if (noteIdxToDelete === -1) return;

  parent.notes.splice(noteIdxToDelete, 1);
}

export function deleteSubfolderFromFolder(subfolderToDelete: FolderWithContents, parent: FolderWithContents) {
  const folderIdxToDelete = parent.subfolders.findIndex((folder) => folder.id === subfolderToDelete.id);

  if (folderIdxToDelete === -1) return;

  parent.subfolders.splice(folderIdxToDelete, 1);
}

export function updateNoteInFolder(noteToUpdate: NoteMinimal, fieldsToUpdate: Partial<NoteMinimal>, parent: FolderWithContents) {
  const noteIdxToUpdate = parent.notes.findIndex((note) => note.id === noteToUpdate.id);

  if (noteIdxToUpdate === -1) return;

  parent.notes[noteIdxToUpdate] = {
    ...noteToUpdate,
    ...fieldsToUpdate,
  };
}

export function updateSubfolderInFolder(
  folderToUpdate: FolderWithContents,
  fieldsToUpdate: Partial<FolderWithContents>,
  parentFolder: FolderWithContents) {
  const folderIdxToUpdate = parentFolder.subfolders.findIndex((folder) => folder.id === folderToUpdate.id);

  if (fieldsToUpdate.creating === false && folderIdxToUpdate === -1)
    parentFolder.subfolders.push({ ...folderToUpdate, ...fieldsToUpdate });

  parentFolder.subfolders[folderIdxToUpdate] = {
    ...folderToUpdate,
    ...fieldsToUpdate,
  };
}
