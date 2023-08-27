// import { LRUCache } from 'lru-cache';
// NOTE: keep an eye on this package
import LRUCache from '@tinkoff/lru-cache-nano';

export const useCurrentItemForDetails = () => useState<FolderOrNote | null>(() => null);
export const useRootFolderContents = () => useState<FolderWithContents | null>(() => null);
export const useCurrentNoteState = () => useState<'' | 'updating' | 'fetching' | 'saved'>(() => '' as const);

const notesCache = new LRUCache<string, SerializedNote>({ max: 100 });
export const useNotesCache = () => notesCache;

const foldersCache = new LRUCache<string, FolderWithContents>({ max: 25 });
export const useFoldersCache = () => foldersCache;

const fuzzyWorker = shallowRef<null | IFuzzyWorker>(null);
export const useFuzzyWorker = () => fuzzyWorker;

const offlineStorage = shallowRef<null | OfflineStorage>(import.meta.server ? null : getOfflineStorage());
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
  Object.assign(noteToUpdate, fieldsToUpdate);

  if (fieldsToUpdate.creating === true || fieldsToUpdate.editing === true)
    return;

  if (fuzzyWorker.value) fuzzyWorker.value.refreshItemsCache();
  if (offlineStorage.value) {
    offlineStorage.value.removeItem(noteToUpdate.path);
    offlineStorage.value.setItem(noteToUpdate.path, toRaw(noteToUpdate));
  }
}

export function updateSubfolderInFolder(
  folderToUpdate: FolderWithContents,
  fieldsToUpdate: Partial<FolderWithContents>,
  parentFolder: FolderWithContents) {
  Object.assign(folderToUpdate, fieldsToUpdate);

  if (fieldsToUpdate.creating === true || fieldsToUpdate.editing === true)
    return;

  if (fuzzyWorker.value) fuzzyWorker.value.refreshItemsCache();
  if (offlineStorage.value) {
    offlineStorage.value.removeItem(folderToUpdate.path);
    offlineStorage.value.setItem(folderToUpdate.path, toRaw(folderToUpdate));
  }
}
