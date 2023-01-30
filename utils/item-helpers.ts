import { withLeadingSlash, withoutLeadingSlash } from 'ufo';

import type { Note } from '@prisma/client';
import type { RouteLocationNamedRaw } from 'vue-router';
import type { NavigateToOptions } from 'nuxt/dist/app/composables/router';

import { blankNoteName } from '~/assets/constants';

type ItemWithPath = Partial<FolderOrNote> & { path: string };
export function generateItemRouteParams(item: ItemWithPath): RouteLocationNamedRaw {
  const isFolder = 'root' in item;

  const routeName = isFolder ? blankNoteName : (item as NoteMinimal).name;
  const routeFolders = withoutLeadingSlash(item.path)
    .split('/')
    .slice(1)
    // removing last item in array if item is note
    .filter((_, i, array) => isFolder ? true : i !== array.length - 1)
    .map(decodeURIComponent);

  return {
    name: '@user-folders-note',
    params: { folders: routeFolders, note: routeName },
  };
}

export async function showItem(item: ItemWithPath, options: NavigateToOptions = {}) {
  const itemRouteParams = generateItemRouteParams(item);

  await navigateTo(itemRouteParams, options);
}

export function preCreateItem(folderToAppend: FolderWithContents, initialValues?: Partial<NoteMinimal>) {
  const id = BigInt(Math.floor(Math.random() * 1000));

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

  const path = withLeadingSlash(
    (Array.isArray(route.params.folders) ? route.params.folders.join('/') : route.params.folders),
  );

  return path === '/' ? '' : path;
}

export async function createFolder(folderName: string, self: FolderOrNote, parent: FolderWithContents) {
  const foldersCache = useFoldersCache();

  const currentFolderPath = getCurrentFolderPath();
  const newFolderPathName = encodeURIComponent(decodeURIComponent(folderName.trim()));
  const newFolderPath = currentFolderPath + withLeadingSlash(newFolderPathName);

  const newlyCreatedFolder = await $fetch<FolderWithContents>(`/api/folder${newFolderPath}`, {
    method: 'POST',
    body: { name: folderName, parentId: parent.id },
  });

  newlyCreatedFolder.notes = newlyCreatedFolder.notes || [];
  newlyCreatedFolder.subfolders = newlyCreatedFolder.subfolders || [];

  foldersCache.set(newlyCreatedFolder.path, newlyCreatedFolder);

  deleteNoteFromFolder(self, parent);
  updateSubfolderInFolder(self, { ...newlyCreatedFolder, creating: false }, parent);

  // TODO: show item
  showItem(newlyCreatedFolder);
}

export async function createNote(noteName: string, self: FolderOrNote, parent: FolderWithContents) {
  const notesCache = useNotesCache();

  const currentFolderPath = getCurrentFolderPath();
  const newNotePathName = encodeURIComponent(decodeURIComponent(noteName.trim()));
  const newNotePath = currentFolderPath + withLeadingSlash(newNotePathName);

  const newlyCreatedNote = await $fetch<Note>(`/api/note${newNotePath}`, {
    method: 'POST',
    body: { parentId: parent.id },
  });

  notesCache.set(newlyCreatedNote.id.toString(), newlyCreatedNote);
  updateNoteInFolder(self, { ...newlyCreatedNote, content: '', creating: false }, parent);

  showItem(newlyCreatedNote as FolderOrNote);
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
  const noteName = encodeURIComponent(decodeURIComponent(self.name));
  const notePath = currentFolderPath + withLeadingSlash(noteName);

  await $fetch<QuickResponse>(`/api/note${notePath}`, { method: 'PATCH', body: newNote })
    .catch(() => updateNoteInFolder(self, { editing: false }, parent));

  const { user: username } = useRoute().params;
  const newNotePath = `/${username}${currentFolderPath}${withLeadingSlash(encodeURIComponent(newNote.name))}`;

  notesCache.delete(self.path);

  updateNoteInFolder(self, { editing: false, ...newNote, path: newNotePath }, parent);

  showItem({ ...self, ...newNote, path: newNotePath }, { replace: true });
}

export async function deleteNote(self: FolderOrNote, parent: FolderWithContents) {
  const notesCache = useNotesCache();

  const currentFolderPath = getCurrentFolderPath();
  const noteName = encodeURIComponent(decodeURIComponent(self.name));
  const notePath = currentFolderPath + withLeadingSlash(noteName);

  await $fetch<QuickResponse>(`/api/note${notePath}`, { method: 'DELETE' });

  showItem(parent, { replace: true });

  deleteNoteFromFolder(self, parent);
  notesCache.delete(self.path);
}

export async function deleteFolder(self: FolderOrNote, parent: FolderWithContents) {
  const foldersCache = useFoldersCache();

  const currentFolderPath = getCurrentFolderPath();
  const folderName = encodeURIComponent(decodeURIComponent(self.name));
  const folderPath = currentFolderPath + withLeadingSlash(folderName);

  await $fetch<QuickResponse>(`/api/folder${folderPath}`, { method: 'DELETE' });

  deleteSubfolderFromFolder(self, parent);

  foldersCache.delete(self.path);
}
