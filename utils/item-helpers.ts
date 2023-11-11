import escapeRE from 'escape-string-regexp';

import type { RouteLocationRaw } from 'vue-router';
import type { NavigateToOptions } from '#app/composables/router';

type ItemWithPath = Record<string, any> & { root?: boolean; path: string };
export function generateItemPath(item: ItemWithPath): RouteLocationRaw {
  const isFolder = 'root' in item;
  let path = item.path.replace('/', '/@');

  if (isFolder)
    path += `/${BLANK_NOTE_NAME}`;

  return path;
}

export async function showItem(item: ItemWithPath, options?: NavigateToOptions) {
  const itemRouteParams = generateItemPath(item);

  await navigateTo(itemRouteParams, options);
}

export function preCreateItem(folderToAppend: FolderWithContents, initialValues?: Partial<NoteMinimal>) {
  const id = Math.floor(Math.random() * 1000).toString();

  const noteValues = {
    id,
    name: '',
    path: '',
    creating: true,
  };

  if (initialValues)
    Object.assign(noteValues, initialValues);

  folderToAppend.notes.unshift(noteValues);
}

export function getCurrentFolderPath() {
  const route = useRoute();

  return Array.isArray(route.params.folders) && route.params.folders.length > 0
    ? `/${route.params.folders.map(encodeURIComponent).join('/')}/`
    : '/';
}

export async function createFolder(folderName: string, self: FolderOrNote, parent: FolderWithContents) {
  const createToast = useToast();

  const currentFolderPath = getCurrentFolderPath();
  const newFolderPathName = encodeURIComponent(folderName.trim());
  const newFolderPath = currentFolderPath + newFolderPathName;

  const res = await $fetch<{ data: FolderWithContents }>(`/api/folder${newFolderPath}`, {
    method: 'POST',
    body: { name: folderName, parentId: parent.id },
  })
    .catch((err) => { createToast(err.data.statusMessage); });

  if (!res)
    return;

  const { data: newlyCreatedFolder } = res;
  const foldersCache = useFoldersCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  newlyCreatedFolder.creating = false;
  parent.subfolders.push(newlyCreatedFolder);

  deleteNoteFromFolder(self, parent);

  foldersCache.set(newlyCreatedFolder.path, newlyCreatedFolder);
  offlineStorage.setItem?.(newlyCreatedFolder.path, newlyCreatedFolder);
  updateSubfolderInFolder(self, newlyCreatedFolder, parent);
  fuzzyWorker.value?.refreshItemsCache();

  showItem(newlyCreatedFolder);
}

export async function createNote(noteName: string, self: FolderOrNote, parent: FolderWithContents) {
  const createToast = useToast();

  const currentFolderPath = getCurrentFolderPath();
  const newNotePathName = encodeURIComponent(noteName.trim());
  const newNotePath = currentFolderPath + newNotePathName;

  const res = await $fetch<{ data: SerializedNote }>(`/api/note${newNotePath}`, {
    method: 'POST',
    body: { name: noteName, parentId: parent.id },
  })
    .catch((err) => { createToast(err.data.statusMessage); }); // TODO: show to user more pleasing error

  if (!res)
    return;

  const { data: newlyCreatedNote } = res;
  const notesCache = useNotesCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  newlyCreatedNote.content ||= '';
  newlyCreatedNote.creating = false;

  notesCache.set(newlyCreatedNote.path, newlyCreatedNote);
  offlineStorage.setItem?.(newlyCreatedNote.path, newlyCreatedNote);
  updateNoteInFolder(self, newlyCreatedNote, parent);
  fuzzyWorker.value?.refreshItemsCache();

  showItem(newlyCreatedNote);
}

export async function renameFolder(newName: string, self: FolderOrNote, parent: FolderWithContents) {
  const newFolder: Record<string, string | boolean> = { name: newName.trim() };

  if (!newFolder.name)
    return updateSubfolderInFolder(self, { editing: false }, parent);

  const currentFolderPath = getCurrentFolderPath();
  const folderPathName = encodeURIComponent(self.name);
  const folderPath = currentFolderPath + folderPathName;

  const res = await $fetch<QuickResponse>(`/api/folder${folderPath}`, { method: 'PATCH', body: newFolder })
    .catch(() => { updateSubfolderInFolder(self, { editing: false }, parent); });

  if (!res)
    return;

  const notesCache = useNotesCache();
  const foldersCache = useFoldersCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  const folderNameRegex = new RegExp(`${escapeRE(encodeURIComponent(self.name))}$`);
  newFolder.path = self.path.replace(folderNameRegex, encodeURIComponent(newFolder.name));
  newFolder.editing = false;

  const folder = foldersCache.get(self.path);

  foldersCache.delete(self.path);
  offlineStorage.removeItem?.(self.path);

  updateSubfolderInFolder(self, newFolder, parent);
  fuzzyWorker.value?.refreshItemsCache();

  const folderToCache = { ...toRaw(self), notes: [], subfolders: [] };
  foldersCache.set(self.path, folderToCache);
  offlineStorage.setItem?.(self.path, folderToCache);

  if (folder) {
    const itemsToRename = folder.notes.concat(folder.subfolders);

    for (const item of itemsToRename) {
      const cache = 'root' in item ? foldersCache : notesCache;

      cache.delete(item.path);
      offlineStorage.removeItem?.(item.path);
    }
  }
}

export async function renameNote(newName: string, self: FolderOrNote, parent: FolderWithContents) {
  const newNote: Record<string, string | boolean> = { name: newName.trim() };

  if (!newNote.name)
    return updateNoteInFolder(self, { editing: false }, parent);

  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  const res = await $fetch(`/api/note${notePath}`, { method: 'PATCH', body: newNote })
    .catch(() => { updateNoteInFolder(self, { editing: false }, parent); });

  if (!res)
    return;

  const notesCache = useNotesCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  const noteNameRegex = new RegExp(`${escapeRE(encodeURIComponent(self.name))}$`);
  newNote.path = self.path.replace(noteNameRegex, encodeURIComponent(newNote.name));
  newNote.editing = false;

  const note = notesCache.get(self.path);

  notesCache.delete(self.path);
  offlineStorage.removeItem?.(self.path);

  updateNoteInFolder(self, newNote, parent);
  fuzzyWorker.value?.refreshItemsCache();

  if (note) {
    Object.assign(note, newNote);

    notesCache.set(note.path, note);
    offlineStorage.setItem?.(note.path, note);
  }

  // @ts-expect-error setting path two lines before
  showItem(newNote);
}

export async function deleteNote(self: FolderOrNote, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  const res = await $fetch.raw(`/api/note${notePath}`, { method: 'DELETE' })
    .catch(() => null);

  if (!res)
    return;

  const notesCache = useNotesCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  showItem(parent);

  notesCache.delete(self.path);
  offlineStorage.removeItem?.(self.path);
  deleteNoteFromFolder(self, parent);
  fuzzyWorker.value?.refreshItemsCache();
}

export async function deleteFolder(self: FolderOrNote, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const folderPathName = encodeURIComponent(self.name);
  const folderPath = currentFolderPath + folderPathName;

  const res = await $fetch.raw<null>(`/api/folder${folderPath}`, { method: 'DELETE' })
    .catch(() => null);

  if (!res)
    return;

  const foldersCache = useFoldersCache();
  const offlineStorage = useOfflineStorage();
  const fuzzyWorker = useFuzzyWorker();

  foldersCache.delete(self.path);
  offlineStorage.removeItem?.(self.path);

  const itemPathToCheck = `${self.path}/`;
  offlineStorage.getAllItems?.()
    .then((items: Array<FolderOrNote>) => {
      for (const item of items) {
        if (!item.path.startsWith(itemPathToCheck))
          continue;

        offlineStorage.removeItem?.(item.path);
      }
    });

  deleteSubfolderFromFolder(self, parent);
  fuzzyWorker.value?.refreshItemsCache();
}

// NOTE: Refactor all functions above to use this approach ?
export async function preloadItem(self: FolderOrNote) {
  const isFolder = 'root' in self;

  const currentFolderPath = getCurrentFolderPath();
  const pathPrefix = isFolder ? 'folder' : 'note';
  const pathName = encodeURIComponent(self.name);
  const path = pathPrefix + currentFolderPath + pathName;

  const item = await $fetch<{ data: FolderWithContents | NoteMinimal }>(`/api/${path}`)
    .catch(() => null);

  if (!item) return;

  const offlineStorage = useOfflineStorage();
  const notesCache = useNotesCache();
  const foldersCache = useFoldersCache();

  const cache = isFolder ? foldersCache : notesCache;

  // @ts-expect-error idk how to setup this type
  cache.set(item.path, item);
  offlineStorage.setItem?.(item.data.path, item);
}
