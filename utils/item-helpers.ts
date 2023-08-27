import { withLeadingSlash, withoutLeadingSlash } from 'ufo';

import type { RouteLocationRaw } from 'vue-router';
import type { NavigateToOptions } from '#app/composables/router';

interface ItemWithPath { root?: boolean; path: string }
export function generateItemRouteParams(item: ItemWithPath): RouteLocationRaw {
  const user = useUser();
  const route = useRoute();

  const isFolder = 'root' in item;

  const username = user.value?.username || route.params.user;
  const routeName = isFolder ? BLANK_NOTE_NAME : (item as NoteMinimal).name;
  const routeFolders = withoutLeadingSlash(item.path)
    .split('/')
    .slice(1)
    // removing last item in array if item is note
    .filter((_, i, array) => isFolder ? true : i !== array.length - 1)
    .map(decodeURIComponent);

  return {
    name: '@user-folders-note',
    params: { user: username, folders: routeFolders, note: routeName },
  };
}

export async function showItem(item: ItemWithPath, options: NavigateToOptions = {}) {
  const itemRouteParams = generateItemRouteParams(item);

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

  focusItemInput();
}

export function focusItemInput(time: number = 1) {
  if (import.meta.server)
    return;

  setTimeout(() => {
    const input = document.querySelector('#contentsListItemInput') as HTMLInputElement | null;

    if (!input)
      return focusItemInput(100);

    input.focus();
  }, time);
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
    .catch((err) => { createToast(err.data.statusMessage); });

  if (!newlyCreatedNote)
    return;

  newlyCreatedNote.content ||= '';
  newlyCreatedNote.creating = false;

  notesCache.set(newlyCreatedNote.path, newlyCreatedNote);
  updateNoteInFolder(self, newlyCreatedNote, parent);

  showItem(newlyCreatedNote);
}

export async function renameFolder() {
  // TODO
}

export async function renameNote(newName: string, self: FolderOrNote, parent: FolderWithContents) {
  const newNote: Record<string, string | boolean> = { name: newName.trim() };

  if (!newNote.name)
    return updateNoteInFolder(self, { editing: false }, parent);

  const notesCache = useNotesCache();

  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  await $fetch<QuickResponse>(`/api/note${notePath}`, { method: 'PATCH', body: newNote })
    .catch(() => updateNoteInFolder(self, { editing: false }, parent));

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
  const notePath = currentFolderPath + withLeadingSlash(notePathName);

  await $fetch<QuickResponse>(`/api/note${notePath}`, { method: 'DELETE' });

  showItem(parent, { replace: true });

  deleteNoteFromFolder(self, parent);
  notesCache.delete(self.path);
}

export async function deleteFolder(self: FolderOrNote, parent: FolderWithContents) {
  const foldersCache = useFoldersCache();

  const currentFolderPath = getCurrentFolderPath();
  const folderPathName = encodeURIComponent(self.name);
  const folderPath = currentFolderPath + withLeadingSlash(folderPathName);

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
  offlineStorage.value?.setItem(item.path, item);
}
