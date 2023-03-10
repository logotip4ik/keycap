import LRU from 'lru-cache';

import type { Note } from '@prisma/client';

export const useCurrentItemForDetails = () => useState<FolderOrNote | null>(() => null);
export const useRootFolderContents = () => useState<FolderWithContents | null>(() => null);
export const useCurrentNoteState = () => useState<'' | 'updating' | 'fetching' | 'saved'>(() => '' as const);

const notesCache = new LRU<string, Note>({ max: 30 });
export const useNotesCache = () => notesCache;

const foldersCache = new LRU<string, FolderWithContents>({ max: 30 });
export const useFoldersCache = () => foldersCache;

const fuzzyWorker = shallowRef<null | IFuzzyWorker>(null);
export const useFuzzyWorker = () => fuzzyWorker;

const offlineStorage = shallowRef<null | OfflineStorage>(null);
export const useOfflineStorage = () => offlineStorage;

export function deleteNoteFromFolder(noteToDelete: NoteMinimal, parent: FolderWithContents) {
  const noteIdxToDelete = parent.notes.findIndex((note) => note.id === noteToDelete.id);

  if (noteIdxToDelete === -1) return;

  parent.notes.splice(noteIdxToDelete, 1);

  if (fuzzyWorker.value && !noteToDelete.creating) fuzzyWorker.value.refreshItemsCache();
  if (offlineStorage.value) offlineStorage.value.removeItem(noteToDelete.path);
}

export function deleteSubfolderFromFolder(subfolderToDelete: FolderWithContents, parent: FolderWithContents) {
  const folderIdxToDelete = parent.subfolders.findIndex((folder) => folder.id === subfolderToDelete.id);

  if (folderIdxToDelete === -1) return;

  parent.subfolders.splice(folderIdxToDelete, 1);

  if (fuzzyWorker.value) fuzzyWorker.value.refreshItemsCache();
  if (offlineStorage.value) offlineStorage.value.removeItem(subfolderToDelete.path);
}

export function updateNoteInFolder(
  noteToUpdate: NoteMinimal,
  fieldsToUpdate: Partial<NoteMinimal>,
  parent: FolderWithContents) {
  const noteIdxToUpdate = parent.notes.findIndex((note) => note.id === noteToUpdate.id);

  if (noteIdxToUpdate === -1) return;

  const updatedNote = {
    ...noteToUpdate,
    ...fieldsToUpdate,
  };

  parent.notes[noteIdxToUpdate] = updatedNote;

  if (fuzzyWorker.value) fuzzyWorker.value.refreshItemsCache();
  if (offlineStorage.value) {
    offlineStorage.value.removeItem(noteToUpdate.path);
    offlineStorage.value.setItem(updatedNote.path, updatedNote);
  }
}

export function updateSubfolderInFolder(
  folderToUpdate: FolderWithContents,
  fieldsToUpdate: Partial<FolderWithContents>,
  parentFolder: FolderWithContents) {
  const folderIdxToUpdate = parentFolder.subfolders.findIndex((folder) => folder.id === folderToUpdate.id);

  if (fieldsToUpdate.creating === false && folderIdxToUpdate === -1)
    parentFolder.subfolders.push({ ...folderToUpdate, ...fieldsToUpdate });

  const updatedSubfolder = {
    ...folderToUpdate,
    ...fieldsToUpdate,
  };

  parentFolder.subfolders[folderIdxToUpdate] = updatedSubfolder;

  if (fuzzyWorker.value) fuzzyWorker.value.refreshItemsCache();
  if (offlineStorage.value) {
    offlineStorage.value.removeItem(folderToUpdate.path);
    offlineStorage.value.setItem(updatedSubfolder.path, updatedSubfolder);
  }
}
