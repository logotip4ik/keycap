import { withLeadingSlash, withTrailingSlash, withoutLeadingSlash } from 'ufo';

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
    ...(initialValues || {}),
  };

  folderToAppend.notes.unshift(noteValues);

  nextTick(() => {
    (document.querySelector('.item[data-creating="true"] > form > input') as HTMLInputElement | null)?.focus();
  });
}

export function getCurrentFolderPath() {
  const route = useRoute();

  return withLeadingSlash(withTrailingSlash(
    (Array.isArray(route.params.folders)
      ? route.params.folders.map(encodeURIComponent).join('/')
      : encodeURIComponent(route.params.folders || '')),
  ));
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

  newlyCreatedFolder.notes = newlyCreatedFolder.notes || [];
  newlyCreatedFolder.subfolders = newlyCreatedFolder.subfolders || [];

  foldersCache.set(newlyCreatedFolder.path, newlyCreatedFolder);

  deleteNoteFromFolder(self, parent);
  updateSubfolderInFolder(self, { ...newlyCreatedFolder, creating: false }, parent);

  showItem(newlyCreatedFolder);
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

  notesCache.set(newlyCreatedNote.path, newlyCreatedNote);
  updateNoteInFolder(self, { ...newlyCreatedNote, content: '', creating: false }, parent);

  showItem(newlyCreatedNote);
}

export async function renameFolder() {
  // TODO
}

export async function renameNote(newName: string, self: FolderOrNote, parent: FolderWithContents) {
  const newNote = { name: newName.trim() };

  if (!newNote.name)
    return updateNoteInFolder(self, { editing: false }, parent);

  const notesCache = useNotesCache();

  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  await $fetch<QuickResponse>(`/api/note${notePath}`, { method: 'PATCH', body: newNote })
    .catch(() => updateNoteInFolder(self, { editing: false }, parent));

  const { user: username } = useRoute().params;
  const newNotePath = `/${username}${currentFolderPath}${encodeURIComponent(newNote.name)}`;

  notesCache.delete(self.path);
  updateNoteInFolder(self, { editing: false, ...newNote, path: newNotePath }, parent);

  showItem({ ...self, ...newNote, path: newNotePath }, { replace: true });
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
