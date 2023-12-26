import LRUCache from 'hashlru';

import type { Remote } from 'comlink';

export const useCurrentItemForDetails = () => useState<FolderOrNote | null>(() => null);
export const useRootFolderContents = () => useState<FolderWithContents | null>(() => null);

const notesCache = LRUCache(100);
export const useNotesCache = () => notesCache;

const foldersCache = LRUCache(25);
export const useFoldersCache = () => foldersCache;

const fuzzyWorker = shallowRef<null | Prettify<Remote<FuzzyWorker>>>(null);
export const useFuzzyWorker = () => fuzzyWorker;

const offlineStorage = shallowReactive<Partial<OfflineStorage>>(import.meta.server ? {} : getOfflineStorage());
export const useOfflineStorage = () => offlineStorage;

export function deleteNoteFromFolder(noteToDelete: NoteMinimal, parent: FolderWithContents) {
  const noteIdxToDelete = parent.notes.findIndex((note) => note.id === noteToDelete.id);

  if (noteIdxToDelete === -1)
    return;

  parent.notes.splice(noteIdxToDelete, 1);
}

export function deleteSubfolderFromFolder(subfolderToDelete: FolderMinimal, parent: FolderWithContents) {
  const folderIdxToDelete = parent.subfolders.findIndex((folder) => folder.id === subfolderToDelete.id);

  if (folderIdxToDelete === -1)
    return;

  parent.subfolders.splice(folderIdxToDelete, 1);
}

export function updateNoteInFolder(
  noteToUpdate: NoteMinimal,
  fieldsToUpdate: Partial<NoteMinimal>,
  _parent: FolderWithContents,
) {
  Object.assign(noteToUpdate, fieldsToUpdate);
}

export function updateSubfolderInFolder(
  folderToUpdate: FolderMinimal,
  fieldsToUpdate: Partial<FolderMinimal>,
  _parentFolder: FolderWithContents,
) {
  Object.assign(folderToUpdate, fieldsToUpdate);
}
