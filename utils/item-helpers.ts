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
  const foldersCache = useFoldersCache();
  const createToast = useToast();

  const currentFolderPath = getCurrentFolderPath();
  const newFolderPathName = encodeURIComponent(folderName.trim());
  const newFolderPath = currentFolderPath + newFolderPathName;

  const newlyCreatedFolder = await $fetch<FolderWithContents>(`/api/folder${newFolderPath}`, {
    method: 'POST',
    body: { name: folderName, parentId: parent.id },
  })
    .catch((err) => { createToast(err.data.statusMessage); });

  if (!newlyCreatedFolder)
    return;

  newlyCreatedFolder.creating = false;
  parent.subfolders.push(newlyCreatedFolder);

  deleteNoteFromFolder(self, parent);
  updateSubfolderInFolder(self, newlyCreatedFolder, parent);

  showItem(newlyCreatedFolder);
  foldersCache.set(newlyCreatedFolder.path, newlyCreatedFolder);
}

export async function createNote(noteName: string, self: FolderOrNote, parent: FolderWithContents) {
  const notesCache = useNotesCache();
  const createToast = useToast();

  const currentFolderPath = getCurrentFolderPath();
  const newNotePathName = encodeURIComponent(noteName.trim());
  const newNotePath = currentFolderPath + newNotePathName;

  const newlyCreatedNote = await $fetch<SerializedNote>(`/api/note${newNotePath}`, {
    method: 'POST',
    body: { name: noteName, parentId: parent.id },
  })
    .catch((err) => { createToast(err.data.statusMessage); }); // TODO: show to user more pleasing error

  if (!newlyCreatedNote)
    return;

  newlyCreatedNote.content ||= '';
  newlyCreatedNote.creating = false;

  notesCache.set(newlyCreatedNote.path, newlyCreatedNote);
  updateNoteInFolder(self, newlyCreatedNote, parent);

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

  if (!res) return;

  const foldersCache = useFoldersCache();

  const folderNameRegex = new RegExp(`${encodeURIComponent(self.name)}$`);
  newFolder.editing = false;
  newFolder.path = self.path.replace(folderNameRegex, encodeURIComponent(newFolder.name));

  foldersCache.delete(self.path);
  updateSubfolderInFolder(self, newFolder, parent);
}

export async function renameNote(newName: string, self: FolderOrNote, parent: FolderWithContents) {
  const newNote: Record<string, string | boolean> = { name: newName.trim() };

  if (!newNote.name)
    return updateNoteInFolder(self, { editing: false }, parent);

  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  const res = await $fetch<QuickResponse>(`/api/note${notePath}`, { method: 'PATCH', body: newNote })
    .catch(() => { updateNoteInFolder(self, { editing: false }, parent); });

  if (!res) return;

  const notesCache = useNotesCache();

  newNote.editing = false;
  newNote.path = self.path.replace(encodeURIComponent(self.name), encodeURIComponent(newNote.name));

  notesCache.delete(self.path);
  updateNoteInFolder(self, newNote, parent);

  // @ts-expect-error setting path two lines before
  showItem(newNote, { replace: true });
}

export async function deleteNote(self: FolderOrNote, parent: FolderWithContents) {
  const notesCache = useNotesCache();

  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  await $fetch<QuickResponse>(`/api/note${notePath}`, { method: 'DELETE' });

  showItem(parent, { replace: true });

  deleteNoteFromFolder(self, parent);
  notesCache.delete(self.path);
}

export async function deleteFolder(self: FolderOrNote, parent: FolderWithContents) {
  const foldersCache = useFoldersCache();

  const currentFolderPath = getCurrentFolderPath();
  const folderPathName = encodeURIComponent(self.name);
  const folderPath = currentFolderPath + folderPathName;

  await $fetch<QuickResponse>(`/api/folder${folderPath}`, { method: 'DELETE' });

  deleteSubfolderFromFolder(self, parent);
  foldersCache.delete(self.path);
}

// NOTE: Refactor all functions above to use this approach ?
export async function preloadItem(self: FolderOrNote) {
  const isFolder = 'root' in self;

  const currentFolderPath = getCurrentFolderPath();
  const pathPrefix = isFolder ? 'folder' : 'note';
  const pathName = encodeURIComponent(self.name);
  const path = pathPrefix + currentFolderPath + pathName;

  const item = await $fetch<FolderWithContents | NoteMinimal>(`/api/${path}`).catch(() => null);

  if (!item) return;

  const offlineStorage = useOfflineStorage();
  const notesCache = useNotesCache();
  const foldersCache = useFoldersCache();

  const cache = isFolder ? foldersCache : notesCache;

  // @ts-expect-error idk how to setup this type
  cache.set(item.path, item);
  offlineStorage.setItem?.(item.path, item);
}
