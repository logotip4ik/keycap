import type { NavigateToOptions } from '#app/composables/router';

import escapeRE from 'escape-string-regexp';

export function checkIsFolder(item: object): item is FolderWithContents {
  return 'root' in item;
}

interface ItemWithPath {
  root?: boolean
  path: string
}
export function generateItemPath(item: ItemWithPath): string {
  let path = item.path.replace('/', '/@');

  if (checkIsFolder(item)) {
    path += `/${BLANK_NOTE_NAME}`;
  }

  return path;
}

export async function showItem(item: ItemWithPath, options?: NavigateToOptions) {
  const itemRouteParams = generateItemPath(item);

  await navigateTo(itemRouteParams, options);
}

export function preCreateItem(folderToAppend: FolderWithContents, initialValues?: Partial<Pick<NoteMinimal, 'name' | 'path'>>) {
  const id = Math.floor(Math.random() * 1000).toString();

  folderToAppend.notes.unshift({
    id,
    name: initialValues?.name ?? '',
    path: initialValues?.path ?? '',
    state: ItemState.Creating,
  });
}

export function getCurrentFolderPath(_route?: ReturnType<typeof useRoute>) {
  const route = _route || useRoute();

  return isArray(route.params.folders) && route.params.folders.length > 0
    ? `/${route.params.folders.map(encodeURIComponent).join('/')}/`
    : '/';
}

export function getItemPathFromHref(href: string) {
  const user = getUser();

  const workspacePrefix = `/@${user.username}/`;
  const innerPartStart = href.indexOf(workspacePrefix) + workspacePrefix.length;

  const innerPart = href.substring(innerPartStart);
  const parts = innerPart.split('/');

  if (parts.at(-1) === BLANK_NOTE_NAME) {
    parts.pop();
  }

  return parts.map(decodeURIComponent).join('/');
}

export async function createFolder(folderName: string, self: NoteMinimal, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const newFolderPathName = encodeURIComponent(folderName.trim());
  const newFolderPath = currentFolderPath + newFolderPathName;

  const res = await $fetch<{ data: FolderWithContents }>(`/api/folder${newFolderPath}`, {
    method: 'POST',
    body: { name: folderName, parentId: parent.id },
  });

  if (!res) {
    return;
  }

  const { data: newlyCreatedFolder } = res;
  const foldersCache = useFoldersCache();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();

  newlyCreatedFolder.state = undefined;
  parent.subfolders.push(newlyCreatedFolder);

  remove(parent.notes, self);

  foldersCache.set(newlyCreatedFolder.path, newlyCreatedFolder);
  offlineStorage.setItem(newlyCreatedFolder.path, newlyCreatedFolder);
  fuzzyWorker.value?.addItemToCache(newlyCreatedFolder);
  extend(self, newlyCreatedFolder);

  await showItem(newlyCreatedFolder);

  return newlyCreatedFolder;
}

export async function createNote(noteName: string, self: NoteMinimal, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const newNotePathName = encodeURIComponent(noteName.trim());
  const newNotePath = currentFolderPath + newNotePathName;

  const res = await $fetch<{ data: NoteWithContent }>(`/api/note${newNotePath}`, {
    method: 'POST',
    body: { name: noteName, parentId: parent.id },
  });

  if (!res) {
    return;
  }

  const { data: newlyCreatedNote } = res;
  const notesCache = useNotesCache();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();

  newlyCreatedNote.content ||= '';
  newlyCreatedNote.state = undefined;

  notesCache.set(newlyCreatedNote.path, newlyCreatedNote);
  offlineStorage.setItem(newlyCreatedNote.path, newlyCreatedNote);
  fuzzyWorker.value?.addItemToCache(newlyCreatedNote);
  extend(self, newlyCreatedNote);

  await showItem(newlyCreatedNote);

  return newlyCreatedNote;
}

export async function renameFolder(newName: string, self: FolderMinimal) {
  const newFolder: Record<string, string | undefined> = { name: newName.trim() };

  const currentFolderPath = getCurrentFolderPath();
  const folderPathName = encodeURIComponent(self.name);
  const folderPath = currentFolderPath + folderPathName;

  await $fetch<unknown>(`/api/folder${folderPath}`, { method: 'PATCH', body: newFolder });

  const foldersCache = useFoldersCache();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();

  const folderNameRegex = new RegExp(`${escapeRE(encodeURIComponent(self.name))}$`);
  newFolder.path = self.path.replace(folderNameRegex, encodeURIComponent(newFolder.name!));
  newFolder.state = undefined;

  foldersCache.remove(self.path);
  offlineStorage.removeItem(self.path);

  extend(self, newFolder);

  const folderToCache = { ...toRaw(self), notes: [], subfolders: [] };
  foldersCache.set(self.path, folderToCache);
  offlineStorage.setItem(self.path, folderToCache);
  fuzzyWorker.value?.refreshItemsCache().then(validateOfflineStorage);
}

export async function renameNote(newName: string, self: NoteMinimal) {
  const newNote: Record<string, string | undefined> = { name: newName.trim() };

  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  await $fetch(`/api/note${notePath}`, { method: 'PATCH', body: newNote });

  const notesCache = useNotesCache();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();

  const noteNameRegex = new RegExp(`${escapeRE(encodeURIComponent(self.name))}$`);
  newNote.path = self.path.replace(noteNameRegex, encodeURIComponent(newNote.name!));
  newNote.state = undefined;

  const note = notesCache.get(self.path);

  notesCache.remove(self.path);
  offlineStorage.removeItem(self.path);

  extend(self, newNote);
  fuzzyWorker.value?.refreshItemsCache();

  if (note) {
    extend(note, newNote);

    notesCache.set(note.path, note);
    offlineStorage.setItem(note.path, note);
  }

  // @ts-expect-error setting path two lines before
  await showItem(newNote);
}

export async function deleteNote(self: NoteMinimal, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const notePathName = encodeURIComponent(self.name);
  const notePath = currentFolderPath + notePathName;

  const res = await $fetch.raw(`/api/note${notePath}`, { method: 'DELETE' });

  if (!res) {
    return;
  }

  const notesCache = useNotesCache();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();

  await showItem(parent);

  notesCache.remove(self.path);
  offlineStorage.removeItem(self.path);
  fuzzyWorker.value?.refreshItemsCache();
  remove(parent.notes, self);
}

export async function deleteFolder(self: FolderMinimal, parent: FolderWithContents) {
  const currentFolderPath = getCurrentFolderPath();
  const folderPathName = encodeURIComponent(self.name);
  const folderPath = currentFolderPath + folderPathName;

  const res = await $fetch.raw<null>(`/api/folder${folderPath}`, { method: 'DELETE' });

  if (!res) {
    return;
  }

  const foldersCache = useFoldersCache();
  const offlineStorage = getOfflineStorage();
  const fuzzyWorker = getFuzzyWorker();

  foldersCache.remove(self.path);
  offlineStorage.removeItem(self.path);

  const itemPathToCheck = `${self.path}/`;
  const itemsToDelete = await offlineStorage.getItemsKeys()
    .then((keys) => keys.filter((key) => key.startsWith(itemPathToCheck)));
  await Promise.all(
    itemsToDelete.map((key) => offlineStorage.removeItem(key)),
  );

  remove(parent.subfolders, self);
  fuzzyWorker.value?.refreshItemsCache();
}

// NOTE: Refactor all functions above to use this approach ?
export async function preloadItem(self: FolderMinimal | NoteMinimal) {
  const isFolder = checkIsFolder(self);

  const currentFolderPath = getCurrentFolderPath();
  const pathPrefix = isFolder ? 'folder' : 'note';
  const pathName = encodeURIComponent(self.name);
  const path = pathPrefix + currentFolderPath + pathName;

  const res = await $fetch<{ data: FolderWithContents | NoteWithContent }>(`/api/${path}`);

  if (!res) {
    return;
  }

  const offlineStorage = getOfflineStorage();
  const notesCache = useNotesCache();
  const foldersCache = useFoldersCache();

  const item = res.data;

  if (checkIsFolder(item)) {
    foldersCache.set(item.path, item);
  }
  else {
    notesCache.set(item.path, item);
  }

  offlineStorage.setItem(item.path, item);
}
